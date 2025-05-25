import {apiClient} from './apiClient';
import {Portfolio, Position, PortfolioHistory} from '@tradepro/shared';

interface PortfolioPerformance {
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  weekChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
  yearChange: number;
  yearChangePercent: number;
}

class PortfolioService {
  async getPortfolio(): Promise<Portfolio> {
    const response = await apiClient.get<Portfolio>('/portfolio/summary');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch portfolio');
    }
    
    return response.data;
  }

  async getPositions(): Promise<Position[]> {
    const response = await apiClient.get<Position[]>('/portfolio/positions');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch positions');
    }
    
    return response.data;
  }

  async getPosition(symbol: string): Promise<Position> {
    const response = await apiClient.get<Position>(`/portfolio/positions/${symbol}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch position');
    }
    
    return response.data;
  }

  async getPortfolioHistory(period: string = '1Y'): Promise<PortfolioHistory[]> {
    const response = await apiClient.get<PortfolioHistory[]>(`/portfolio/history?period=${period}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch portfolio history');
    }
    
    return response.data;
  }

  async getPerformance(): Promise<PortfolioPerformance> {
    const response = await apiClient.get<PortfolioPerformance>('/portfolio/performance');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch performance data');
    }
    
    return response.data;
  }

  async getDiversification(): Promise<{
    byAssetType: Array<{type: string; value: number; percentage: number}>;
    bySector: Array<{sector: string; value: number; percentage: number}>;
    byRegion: Array<{region: string; value: number; percentage: number}>;
  }> {
    const response = await apiClient.get('/portfolio/diversification');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch diversification data');
    }
    
    return response.data;
  }

  async getWatchlistQuotes(): Promise<Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>> {
    const response = await apiClient.get('/portfolio/watchlist-quotes');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch watchlist quotes');
    }
    
    return response.data;
  }
}

export const portfolioService = new PortfolioService();