import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import winston from 'winston';

import { MarketDataService } from './services/MarketDataService';
import { SubscriptionManager } from './services/SubscriptionManager';
import { AuthService } from './services/AuthService';

dotenv.config();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/websocket.log' })
  ]
});

const app = express();
const server = createServer(app);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Services
const marketDataService = new MarketDataService(redisClient, logger);
const subscriptionManager = new SubscriptionManager(redisClient, logger);
const authService = new AuthService();

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await authService.validateUser(decoded.userId);
    
    if (!user) {
      return next(new Error('Invalid user'));
    }

    socket.data.user = user;
    socket.data.userId = user.id;
    
    logger.info(`User ${user.id} connected via WebSocket`);
    next();
  } catch (error) {
    logger.error('Socket authentication failed:', error);
    next(new Error('Authentication failed'));
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  logger.info(`Socket connected: ${socket.id} for user ${userId}`);

  // Join user-specific room
  socket.join(`user:${userId}`);

  // Handle authentication
  socket.on('authenticate', async (data) => {
    try {
      socket.emit('authenticated', { success: true });
      logger.info(`User ${userId} authenticated successfully`);
    } catch (error) {
      socket.emit('authentication_error', { error: 'Authentication failed' });
    }
  });

  // Handle market data subscriptions
  socket.on('subscribe_quotes', async (data) => {
    try {
      const { symbols } = data;
      if (!Array.isArray(symbols)) {
        socket.emit('error', { message: 'Symbols must be an array' });
        return;
      }

      await subscriptionManager.subscribe(userId, symbols);
      
      // Join symbol-specific rooms
      symbols.forEach(symbol => {
        socket.join(`symbol:${symbol}`);
      });

      // Send current quotes
      const quotes = await marketDataService.getQuotes(symbols);
      quotes.forEach(quote => {
        socket.emit('market_data', quote);
      });

      logger.info(`User ${userId} subscribed to symbols: ${symbols.join(', ')}`);
    } catch (error) {
      logger.error('Subscription error:', error);
      socket.emit('error', { message: 'Subscription failed' });
    }
  });

  // Handle unsubscription
  socket.on('unsubscribe_quotes', async (data) => {
    try {
      const { symbols } = data;
      await subscriptionManager.unsubscribe(userId, symbols);
      
      // Leave symbol-specific rooms
      symbols.forEach(symbol => {
        socket.leave(`symbol:${symbol}`);
      });

      logger.info(`User ${userId} unsubscribed from symbols: ${symbols.join(', ')}`);
    } catch (error) {
      logger.error('Unsubscription error:', error);
      socket.emit('error', { message: 'Unsubscription failed' });
    }
  });

  // Handle order updates subscription
  socket.on('subscribe_orders', () => {
    socket.join(`orders:${userId}`);
    logger.info(`User ${userId} subscribed to order updates`);
  });

  // Handle portfolio updates subscription
  socket.on('subscribe_portfolio', () => {
    socket.join(`portfolio:${userId}`);
    logger.info(`User ${userId} subscribed to portfolio updates`);
  });

  // Handle news subscription
  socket.on('subscribe_news', (data) => {
    const { symbols } = data;
    if (symbols && Array.isArray(symbols)) {
      symbols.forEach(symbol => {
        socket.join(`news:${symbol}`);
      });
    }
    socket.join('news:general');
    logger.info(`User ${userId} subscribed to news updates`);
  });

  // Handle disconnection
  socket.on('disconnect', async (reason) => {
    logger.info(`Socket disconnected: ${socket.id} for user ${userId}, reason: ${reason}`);
    
    try {
      // Clean up subscriptions
      await subscriptionManager.cleanupUserSubscriptions(userId);
    } catch (error) {
      logger.error('Error cleaning up subscriptions:', error);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    logger.error(`Socket error for user ${userId}:`, error);
  });
});

// Market data broadcasting
setInterval(async () => {
  try {
    // Get all active symbols
    const activeSymbols = await subscriptionManager.getActiveSymbols();
    
    if (activeSymbols.length > 0) {
      // Fetch latest market data
      const quotes = await marketDataService.getQuotes(activeSymbols);
      
      // Broadcast to subscribers
      quotes.forEach(quote => {
        io.to(`symbol:${quote.symbol}`).emit('market_data', quote);
      });
    }
  } catch (error) {
    logger.error('Error broadcasting market data:', error);
  }
}, 1000); // Broadcast every second

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
    uptime: process.uptime(),
  });
});

// Start server
async function startServer() {
  try {
    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Initialize services
    await marketDataService.initialize();
    await subscriptionManager.initialize();

    const PORT = process.env.WS_PORT || 3001;
    server.listen(PORT, () => {
      logger.info(`WebSocket server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await redisClient.quit();
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start WebSocket server:', error);
    process.exit(1);
  }
}

startServer();

// Export for testing
export { io, server };