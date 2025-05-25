// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    ENABLE_2FA: '/auth/2fa/enable',
    DISABLE_2FA: '/auth/2fa/disable',
    VERIFY_2FA: '/auth/2fa/verify'
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete-account'
  },
  
  // Market Data
  MARKET: {
    QUOTES: '/market/quotes',
    QUOTE: '/market/quote',
    SEARCH: '/market/search',
    CHART: '/market/chart',
    ORDER_BOOK: '/market/orderbook',
    MOVERS: '/market/movers',
    SECTORS: '/market/sectors'
  },
  
  // Trading
  TRADING: {
    ORDERS: '/trading/orders',
    PLACE_ORDER: '/trading/orders/place',
    CANCEL_ORDER: '/trading/orders/cancel',
    ORDER_HISTORY: '/trading/orders/history',
    TRADES: '/trading/trades',
    POSITIONS: '/trading/positions'
  },
  
  // Portfolio
  PORTFOLIO: {
    SUMMARY: '/portfolio/summary',
    POSITIONS: '/portfolio/positions',
    HISTORY: '/portfolio/history',
    PERFORMANCE: '/portfolio/performance'
  },
  
  // Watchlists
  WATCHLIST: {
    LIST: '/watchlists',
    CREATE: '/watchlists',
    UPDATE: '/watchlists',
    DELETE: '/watchlists',
    ADD_SYMBOL: '/watchlists/symbols',
    REMOVE_SYMBOL: '/watchlists/symbols'
  },
  
  // Alerts
  ALERTS: {
    LIST: '/alerts',
    CREATE: '/alerts',
    UPDATE: '/alerts',
    DELETE: '/alerts'
  },
  
  // News
  NEWS: {
    LIST: '/news',
    SEARCH: '/news/search',
    BY_SYMBOL: '/news/symbol'
  }
} as const;

// WebSocket Events
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Authentication
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  
  // Market Data
  SUBSCRIBE_QUOTES: 'subscribe_quotes',
  UNSUBSCRIBE_QUOTES: 'unsubscribe_quotes',
  MARKET_DATA: 'market_data',
  ORDER_BOOK_UPDATE: 'order_book_update',
  
  // Trading
  ORDER_UPDATE: 'order_update',
  TRADE_UPDATE: 'trade_update',
  POSITION_UPDATE: 'position_update',
  
  // Portfolio
  PORTFOLIO_UPDATE: 'portfolio_update',
  
  // Alerts
  PRICE_ALERT: 'price_alert',
  
  // News
  NEWS_UPDATE: 'news_update'
} as const;

// Market Constants
export const MARKET_HOURS = {
  NYSE: {
    OPEN: '09:30',
    CLOSE: '16:00',
    TIMEZONE: 'America/New_York'
  },
  NASDAQ: {
    OPEN: '09:30',
    CLOSE: '16:00',
    TIMEZONE: 'America/New_York'
  },
  CRYPTO: {
    OPEN: '00:00',
    CLOSE: '23:59',
    TIMEZONE: 'UTC'
  }
} as const;

export const MARKET_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PRE_MARKET: 'PRE_MARKET',
  AFTER_HOURS: 'AFTER_HOURS'
} as const;

// Trading Constants
export const ORDER_LIMITS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 1000000,
  MAX_ORDER_VALUE: 1000000
} as const;

export const COMMISSION_RATES = {
  STOCK: 0, // Commission-free stock trading
  OPTIONS: 0.65, // Per contract
  CRYPTO: 0.005, // 0.5% of trade value
  FOREX: 0.0001 // 1 pip spread
} as const;

// Chart Constants
export const CHART_TIMEFRAMES = {
  '1m': { label: '1 Minute', value: '1m', seconds: 60 },
  '5m': { label: '5 Minutes', value: '5m', seconds: 300 },
  '15m': { label: '15 Minutes', value: '15m', seconds: 900 },
  '30m': { label: '30 Minutes', value: '30m', seconds: 1800 },
  '1h': { label: '1 Hour', value: '1h', seconds: 3600 },
  '4h': { label: '4 Hours', value: '4h', seconds: 14400 },
  '1d': { label: '1 Day', value: '1d', seconds: 86400 },
  '1w': { label: '1 Week', value: '1w', seconds: 604800 },
  '1M': { label: '1 Month', value: '1M', seconds: 2592000 }
} as const;

export const TECHNICAL_INDICATORS = {
  SMA: 'Simple Moving Average',
  EMA: 'Exponential Moving Average',
  RSI: 'Relative Strength Index',
  MACD: 'MACD',
  BOLLINGER: 'Bollinger Bands',
  STOCHASTIC: 'Stochastic Oscillator',
  WILLIAMS_R: 'Williams %R',
  CCI: 'Commodity Channel Index',
  ADX: 'Average Directional Index',
  VOLUME: 'Volume'
} as const;

// App Constants
export const APP_CONFIG = {
  NAME: 'TradePro',
  VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  WS_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  CACHE_DURATION: 300000, // 5 minutes
  REFRESH_TOKEN_THRESHOLD: 300000, // 5 minutes before expiry
  BIOMETRIC_TIMEOUT: 300000, // 5 minutes
  SESSION_TIMEOUT: 1800000 // 30 minutes
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  SYMBOL_REGEX: /^[A-Z]{1,5}$/,
  MAX_WATCHLIST_SYMBOLS: 50,
  MAX_WATCHLISTS: 10,
  MAX_ALERTS: 100
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INSUFFICIENT_FUNDS: 'Insufficient funds to place this order.',
  MARKET_CLOSED: 'Market is currently closed.',
  INVALID_SYMBOL: 'Invalid trading symbol.',
  ORDER_NOT_FOUND: 'Order not found.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in.',
  REGISTER_SUCCESS: 'Account created successfully.',
  ORDER_PLACED: 'Order placed successfully.',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  ALERT_CREATED: 'Price alert created successfully.',
  WATCHLIST_CREATED: 'Watchlist created successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  TWO_FA_ENABLED: 'Two-factor authentication enabled.',
  TWO_FA_DISABLED: 'Two-factor authentication disabled.'
} as const;

// Colors (for consistent theming)
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  INFO: '#5AC8FA',
  
  // Market Colors
  BULL: '#34C759', // Green for positive
  BEAR: '#FF3B30', // Red for negative
  NEUTRAL: '#8E8E93', // Gray for neutral
  
  // Background Colors
  BACKGROUND_LIGHT: '#FFFFFF',
  BACKGROUND_DARK: '#000000',
  SURFACE_LIGHT: '#F2F2F7',
  SURFACE_DARK: '#1C1C1E',
  
  // Text Colors
  TEXT_PRIMARY_LIGHT: '#000000',
  TEXT_PRIMARY_DARK: '#FFFFFF',
  TEXT_SECONDARY_LIGHT: '#3C3C43',
  TEXT_SECONDARY_DARK: '#EBEBF5',
  
  // Border Colors
  BORDER_LIGHT: '#C6C6C8',
  BORDER_DARK: '#38383A'
} as const;

// Asset Types
export const ASSET_TYPES = {
  STOCK: 'STOCK',
  ETF: 'ETF',
  CRYPTO: 'CRYPTO',
  FOREX: 'FOREX',
  COMMODITY: 'COMMODITY',
  INDEX: 'INDEX'
} as const;

// Popular Symbols
export const POPULAR_SYMBOLS = {
  STOCKS: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'BABA'],
  CRYPTO: ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD', 'LINKUSD', 'LTCUSD', 'BCHUSD', 'XLMUSD', 'XRPUSD', 'SOLUSD'],
  FOREX: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP'],
  COMMODITIES: ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'COPPER', 'PLATINUM', 'PALLADIUM', 'WHEAT', 'CORN', 'COFFEE']
} as const;