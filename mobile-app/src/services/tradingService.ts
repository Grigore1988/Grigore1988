import {apiClient} from './apiClient';
import {Order, Trade, PlaceOrderRequest, Position} from '@tradepro/shared';

interface PlaceOrderResponse {
  order: Order;
  message: string;
}

interface OrderHistoryResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TradeHistoryResponse {
  trades: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class TradingService {
  async placeOrder(orderData: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const response = await apiClient.post<PlaceOrderResponse>('/trading/orders/place', orderData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to place order');
    }
    
    return response.data;
  }

  async cancelOrder(orderId: string): Promise<void> {
    const response = await apiClient.delete(`/trading/orders/${orderId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel order');
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/trading/orders/${orderId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order');
    }
    
    return response.data;
  }

  async getOrders(status?: string, page = 1, limit = 20): Promise<OrderHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && {status}),
    });
    
    const response = await apiClient.get<OrderHistoryResponse>(`/trading/orders?${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch orders');
    }
    
    return response.data;
  }

  async getOrderHistory(page = 1, limit = 20): Promise<OrderHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiClient.get<OrderHistoryResponse>(`/trading/orders/history?${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order history');
    }
    
    return response.data;
  }

  async getTrades(page = 1, limit = 20): Promise<TradeHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiClient.get<TradeHistoryResponse>(`/trading/trades?${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch trades');
    }
    
    return response.data;
  }

  async getPositions(): Promise<Position[]> {
    const response = await apiClient.get<Position[]>('/trading/positions');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch positions');
    }
    
    return response.data;
  }

  async getPosition(symbol: string): Promise<Position> {
    const response = await apiClient.get<Position>(`/trading/positions/${symbol}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch position');
    }
    
    return response.data;
  }

  async closePosition(symbol: string, quantity?: number): Promise<PlaceOrderResponse> {
    const response = await apiClient.post<PlaceOrderResponse>(`/trading/positions/${symbol}/close`, {
      quantity,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to close position');
    }
    
    return response.data;
  }

  async modifyOrder(orderId: string, updates: Partial<PlaceOrderRequest>): Promise<Order> {
    const response = await apiClient.patch<Order>(`/trading/orders/${orderId}`, updates);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to modify order');
    }
    
    return response.data;
  }

  async getOrderEstimate(orderData: PlaceOrderRequest): Promise<{
    estimatedCost: number;
    commission: number;
    totalCost: number;
    buyingPower: number;
  }> {
    const response = await apiClient.post<{
      estimatedCost: number;
      commission: number;
      totalCost: number;
      buyingPower: number;
    }>('/trading/orders/estimate', orderData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get order estimate');
    }
    
    return response.data;
  }
}

export const tradingService = new TradingService();