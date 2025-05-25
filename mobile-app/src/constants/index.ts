export * from './Colors';

export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.tradepro.com/api';

export const WS_BASE_URL = __DEV__ 
  ? 'ws://localhost:3001' 
  : 'wss://ws.tradepro.com';

export const APP_CONFIG = {
  NAME: 'TradePro',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  API_TIMEOUT: 30000,
  WS_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  CACHE_DURATION: 300000, // 5 minutes
  REFRESH_TOKEN_THRESHOLD: 300000, // 5 minutes before expiry
  BIOMETRIC_TIMEOUT: 300000, // 5 minutes
  SESSION_TIMEOUT: 1800000, // 30 minutes
};

export const SCREEN_NAMES = {
  // Auth Stack
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  TWO_FACTOR: 'TwoFactor',
  
  // Main Tabs
  DASHBOARD: 'Dashboard',
  MARKETS: 'Markets',
  TRADING: 'Trading',
  PORTFOLIO: 'Portfolio',
  SETTINGS: 'Settings',
  
  // Market Stack
  MARKET_DETAIL: 'MarketDetail',
  SEARCH: 'Search',
  WATCHLIST: 'Watchlist',
  
  // Trading Stack
  ORDER_FORM: 'OrderForm',
  ORDER_CONFIRMATION: 'OrderConfirmation',
  ORDER_HISTORY: 'OrderHistory',
  
  // Portfolio Stack
  POSITION_DETAIL: 'PositionDetail',
  PERFORMANCE: 'Performance',
  
  // Settings Stack
  PROFILE: 'Profile',
  SECURITY: 'Security',
  NOTIFICATIONS: 'Notifications',
  PREFERENCES: 'Preferences',
  HELP: 'Help',
  ABOUT: 'About',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@tradepro/auth_token',
  REFRESH_TOKEN: '@tradepro/refresh_token',
  USER_DATA: '@tradepro/user_data',
  THEME: '@tradepro/theme',
  BIOMETRIC_ENABLED: '@tradepro/biometric_enabled',
  WATCHLISTS: '@tradepro/watchlists',
  SETTINGS: '@tradepro/settings',
  ONBOARDING_COMPLETED: '@tradepro/onboarding_completed',
} as const;

export const CHART_TIMEFRAMES = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' },
] as const;

export const ORDER_TYPES = [
  { label: 'Market', value: 'MARKET' },
  { label: 'Limit', value: 'LIMIT' },
  { label: 'Stop Loss', value: 'STOP_LOSS' },
  { label: 'Take Profit', value: 'TAKE_PROFIT' },
] as const;

export const TIME_IN_FORCE = [
  { label: 'Good Till Cancelled', value: 'GTC' },
  { label: 'Day Order', value: 'DAY' },
  { label: 'Immediate or Cancel', value: 'IOC' },
  { label: 'Fill or Kill', value: 'FOK' },
] as const;

export const POPULAR_SYMBOLS = {
  STOCKS: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'],
  CRYPTO: ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD', 'LINKUSD', 'LTCUSD'],
  FOREX: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'],
} as const;

export const MARKET_SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Communication Services',
  'Industrials',
  'Consumer Defensive',
  'Energy',
  'Utilities',
  'Real Estate',
  'Basic Materials',
] as const;