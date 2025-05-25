import {apiClient} from './apiClient';
import {MarketQuote, CandlestickData, OrderBook} from '@tradepro/shared';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface MarketMovers {
  gainers: MarketQuote[];
  losers: MarketQuote[];
  mostActive: MarketQuote[];
}

interface ChartDataResponse {
  symbol: string;
  timeframe: string;
  data: CandlestickData[];
}

class MarketService {
  async getQuote(symbol: string): Promise<MarketQuote> {
    const response = await apiClient.get<MarketQuote>(`/market/quote/${symbol}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch quote');
    }
    
    return response.data;
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    const response = await apiClient.post<MarketQuote[]>('/market/quotes', {symbols});
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch quotes');
    }
    
    return response.data;
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(`/market/search?q=${encodeURIComponent(query)}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Search failed');
    }
    
    return response.data;
  }

  async getChartData(symbol: string, timeframe: string, limit?: number): Promise<ChartDataResponse> {
    const params = new URLSearchParams({
      timeframe,
      ...(limit && {limit: limit.toString()}),
    });
    
    const response = await apiClient.get<ChartDataResponse>(`/market/chart/${symbol}?${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch chart data');
    }
    
    return response.data;
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const response = await apiClient.get<OrderBook>(`/market/orderbook/${symbol}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order book');
    }
    
    return response.data;
  }

  async getMarketMovers(): Promise<MarketMovers> {
    const response = await apiClient.get<MarketMovers>('/market/movers');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch market movers');
    }
    
    return response.data;
  }

  async getSectorPerformance(): Promise<Array<{sector: string; change: number; changePercent: number}>> {
    const response = await apiClient.get<Array<{sector: string; change: number; changePercent: number}>>('/market/sectors');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch sector performance');
    }
    
    return response.data;
  }

  async getPopularSymbols(category?: string): Promise<string[]> {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get<string[]>(`/market/popular${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch popular symbols');
    }
    
    return response.data;
  }
}

export const marketService = new MarketService();