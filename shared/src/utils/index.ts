import { VALIDATION, ERROR_MESSAGES } from '../constants';

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH && 
         VALIDATION.PASSWORD_REGEX.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validateSymbol = (symbol: string): boolean => {
  return VALIDATION.SYMBOL_REGEX.test(symbol.toUpperCase());
};

// Formatting Utilities
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  decimals: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const formatNumber = (
  number: number, 
  decimals: number = 2,
  compact: boolean = false
): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  };
  
  if (compact) {
    options.notation = 'compact';
    options.compactDisplay = 'short';
  }
  
  return new Intl.NumberFormat('en-US', options).format(number);
};

export const formatPercentage = (
  value: number, 
  decimals: number = 2,
  showSign: boolean = true
): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'always' : 'auto'
  }).format(value / 100);
  
  return formatted;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  }
  return volume.toString();
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `${(marketCap / 1e6).toFixed(2)}M`;
  }
  return formatCurrency(marketCap, 'USD', 0);
};

export const formatDate = (
  date: Date | string, 
  format: 'short' | 'medium' | 'long' | 'time' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    case 'medium':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculation Utilities
export const calculatePercentageChange = (
  current: number, 
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const calculatePnL = (
  quantity: number,
  currentPrice: number,
  averagePrice: number
): { unrealizedPnL: number; unrealizedPnLPercent: number } => {
  const unrealizedPnL = quantity * (currentPrice - averagePrice);
  const unrealizedPnLPercent = calculatePercentageChange(currentPrice, averagePrice);
  
  return { unrealizedPnL, unrealizedPnLPercent };
};

export const calculateOrderValue = (
  quantity: number,
  price: number,
  commission: number = 0
): number => {
  return (quantity * price) + commission;
};

export const calculateCommission = (
  orderValue: number,
  commissionRate: number
): number => {
  return orderValue * commissionRate;
};

// Utility Functions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay * attempt);
      }
    }
  }
  
  throw lastError!;
};

// Array Utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Object Utilities
export const pick = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  
  return obj;
};

// Color Utilities
export const getChangeColor = (
  change: number,
  colors: { positive: string; negative: string; neutral: string }
): string => {
  if (change > 0) return colors.positive;
  if (change < 0) return colors.negative;
  return colors.neutral;
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Storage Utilities
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};

// Market Utilities
export const isMarketOpen = (timezone: string = 'America/New_York'): boolean => {
  const now = new Date();
  const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const day = marketTime.getDay();
  const hour = marketTime.getHours();
  const minute = marketTime.getMinutes();
  const time = hour * 60 + minute;
  
  // Weekend check
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM EST
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  
  return time >= marketOpen && time < marketClose;
};

export const getMarketStatus = (timezone: string = 'America/New_York'): string => {
  const now = new Date();
  const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const day = marketTime.getDay();
  const hour = marketTime.getHours();
  const minute = marketTime.getMinutes();
  const time = hour * 60 + minute;
  
  // Weekend
  if (day === 0 || day === 6) return 'CLOSED';
  
  const preMarketStart = 4 * 60; // 4:00 AM
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  const afterHoursEnd = 20 * 60; // 8:00 PM
  
  if (time >= preMarketStart && time < marketOpen) return 'PRE_MARKET';
  if (time >= marketOpen && time < marketClose) return 'OPEN';
  if (time >= marketClose && time < afterHoursEnd) return 'AFTER_HOURS';
  return 'CLOSED';
};

// Error Handling Utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return ERROR_MESSAGES.GENERIC_ERROR;
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('network') ||
         error?.message?.includes('fetch');
};

// Technical Analysis Utilities
export const calculateSMA = (prices: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateEMA = (prices: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(firstSMA);
  
  for (let i = period; i < prices.length; i++) {
    const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEMA);
  }
  
  return ema;
};

export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate RSI
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
};