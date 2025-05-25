// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Market Data Types
export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  timestamp: Date;
}

export interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: Date;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  orders: number;
}

// Trading Types
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
  STOP_LIMIT = 'STOP_LIMIT'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum TimeInForce {
  GTC = 'GTC', // Good Till Cancelled
  IOC = 'IOC', // Immediate or Cancel
  FOK = 'FOK', // Fill or Kill
  DAY = 'DAY'  // Day order
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  timeInForce: TimeInForce;
  filledQuantity: number;
  averagePrice?: number;
  commission: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface PlaceOrderRequest {
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: TimeInForce;
}

export interface Trade {
  id: string;
  orderId: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  commission: number;
  timestamp: Date;
}

// Portfolio Types
export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  cashBalance: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  positions: Position[];
  updatedAt: Date;
}

export interface PortfolioHistory {
  date: Date;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
}

// Watchlist Types
export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  symbols: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: Date;
  alertPrice?: number;
  alertType?: 'ABOVE' | 'BELOW';
}

// Alert Types
export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  isActive: boolean;
  isTriggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

// News Types
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  url: string;
  imageUrl?: string;
  symbols: string[];
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  publishedAt: Date;
  createdAt: Date;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface MarketDataUpdate extends WebSocketMessage {
  type: 'MARKET_DATA';
  data: MarketQuote;
}

export interface OrderUpdate extends WebSocketMessage {
  type: 'ORDER_UPDATE';
  data: Order;
}

export interface PortfolioUpdate extends WebSocketMessage {
  type: 'PORTFOLIO_UPDATE';
  data: Portfolio;
}

export interface NewsUpdate extends WebSocketMessage {
  type: 'NEWS_UPDATE';
  data: NewsItem;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export enum ErrorCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  MARKET_CLOSED = 'MARKET_CLOSED',
  INVALID_SYMBOL = 'INVALID_SYMBOL',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Chart Types
export interface ChartData {
  symbol: string;
  timeframe: string;
  data: CandlestickData[];
  indicators?: ChartIndicator[];
}

export interface ChartIndicator {
  name: string;
  type: 'line' | 'histogram' | 'overlay';
  data: number[];
  color?: string;
  parameters?: Record<string, any>;
}

// Settings Types
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  notifications: NotificationSettings;
  trading: TradingSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  priceAlerts: boolean;
  orderUpdates: boolean;
  newsUpdates: boolean;
  marketHours: boolean;
}

export interface TradingSettings {
  defaultOrderType: OrderType;
  defaultTimeInForce: TimeInForce;
  confirmationRequired: boolean;
  biometricEnabled: boolean;
  maxOrderValue: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PrivacySettings {
  sharePortfolio: boolean;
  shareWatchlists: boolean;
  analyticsEnabled: boolean;
  marketingEmails: boolean;
}