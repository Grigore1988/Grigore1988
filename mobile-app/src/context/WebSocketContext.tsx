import React, {createContext, useContext, useEffect, useRef, useState, ReactNode} from 'react';
import {io, Socket} from 'socket.io-client';
import {MarketQuote, Order, Portfolio, NewsItem} from '@tradepro/shared';
import {WS_BASE_URL, APP_CONFIG} from '@/constants';
import {useAuth} from './AuthContext';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribeToQuotes: (symbols: string[]) => void;
  unsubscribeFromQuotes: (symbols: string[]) => void;
  onMarketData: (callback: (data: MarketQuote) => void) => void;
  onOrderUpdate: (callback: (data: Order) => void) => void;
  onPortfolioUpdate: (callback: (data: Portfolio) => void) => void;
  onNewsUpdate: (callback: (data: NewsItem) => void) => void;
  removeListener: (event: string, callback: Function) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({children}) => {
  const {tokens, isAuthenticated} = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAuthenticated && tokens) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, tokens]);

  const connectSocket = () => {
    if (socket?.connected) {
      return;
    }

    const newSocket = io(WS_BASE_URL, {
      auth: {
        token: tokens?.accessToken,
      },
      transports: ['websocket'],
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Authenticate the connection
      newSocket.emit('authenticate', {
        token: tokens?.accessToken,
      });
    });

    newSocket.on('authenticated', () => {
      console.log('WebSocket authenticated');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt to reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && isAuthenticated) {
        attemptReconnect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      
      if (isAuthenticated) {
        attemptReconnect();
      }
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    setIsConnected(false);
    reconnectAttempts.current = 0;
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= APP_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      return;
    }

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    const delay = Math.min(
      APP_CONFIG.WS_RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts.current),
      30000
    );

    reconnectTimer.current = setTimeout(() => {
      console.log(`Attempting to reconnect (${reconnectAttempts.current + 1}/${APP_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
      reconnectAttempts.current++;
      connectSocket();
    }, delay);
  };

  const subscribeToQuotes = (symbols: string[]) => {
    if (socket && isConnected) {
      socket.emit('subscribe_quotes', {symbols});
    }
  };

  const unsubscribeFromQuotes = (symbols: string[]) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe_quotes', {symbols});
    }
  };

  const onMarketData = (callback: (data: MarketQuote) => void) => {
    if (socket) {
      socket.on('market_data', callback);
    }
  };

  const onOrderUpdate = (callback: (data: Order) => void) => {
    if (socket) {
      socket.on('order_update', callback);
    }
  };

  const onPortfolioUpdate = (callback: (data: Portfolio) => void) => {
    if (socket) {
      socket.on('portfolio_update', callback);
    }
  };

  const onNewsUpdate = (callback: (data: NewsItem) => void) => {
    if (socket) {
      socket.on('news_update', callback);
    }
  };

  const removeListener = (event: string, callback: Function) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    subscribeToQuotes,
    unsubscribeFromQuotes,
    onMarketData,
    onOrderUpdate,
    onPortfolioUpdate,
    onNewsUpdate,
    removeListener,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};