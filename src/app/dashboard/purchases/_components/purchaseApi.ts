// lib/api/purchaseApi.ts

'use client';
import {
  PurchaseFilters,
  PurchaseResponse,
  SinglePurchaseResponse,
  AnalyticsResponse,
  PurchaseStatus,
  Purchase,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api' || 'http://localhost:3000/api';

class PurchaseApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAllPurchases(filters: Partial<PurchaseFilters>): Promise<PurchaseResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    return this.fetchApi<PurchaseResponse>(`/purchase-details?${queryParams.toString()}`);
  }

  async getDashboardAnalytics(period: string = '30d'): Promise<AnalyticsResponse> {
    return this.fetchApi<AnalyticsResponse>(`/purchase-details/analytics?period=${period}`);
  }

  async getUserPurchases(userId: string): Promise<{ success: boolean; data: Purchase[] }> {
    return this.fetchApi<{ success: boolean; data: Purchase[] }>(
      `/purchase-details/user/${userId}`
    );
  }

  async getPurchaseByOrderId(orderId: string): Promise<SinglePurchaseResponse> {
    return this.fetchApi<SinglePurchaseResponse>(`/purchase-details/order/${orderId}`);
  }

  async getPurchaseById(id: string): Promise<SinglePurchaseResponse> {
    return this.fetchApi<SinglePurchaseResponse>(`/purchase-details/${id}`);
  }

  async updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<SinglePurchaseResponse> {
    return this.fetchApi<SinglePurchaseResponse>(`/purchase-details/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async exportPurchases(filters: Partial<PurchaseFilters>): Promise<Blob> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/purchase-details/export?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export Error: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }
}

export const purchaseApi = new PurchaseApiService();
