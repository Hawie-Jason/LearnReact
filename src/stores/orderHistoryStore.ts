import { defineStore } from 'pinia';
import type { Order } from '@/types';
import { orderService } from '@/services/orderService';

interface OrderHistoryState {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  totalOrders: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export const useOrderHistoryStore = defineStore('orderHistory', {
  state: (): OrderHistoryState => ({
    orders: [],
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
    totalPages: 0,
    isLoading: false,
    error: null
  }),

  getters: {
    hasOrders: (state): boolean => state.orders.length > 0,
    
    hasPreviousPage: (state): boolean => state.currentPage > 1,
    
    hasNextPage: (state): boolean => state.currentPage < state.totalPages
  },

  actions: {
    async fetchOrderHistory(page: number = 1) {
      try {
        this.isLoading = true;
        this.error = null;

        const result = await orderService.getOrderHistory(page, this.pageSize);
        
        this.orders = result.orders;
        this.currentPage = result.page;
        this.totalOrders = result.total;
        this.totalPages = result.totalPages;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch order history';
      } finally {
        this.isLoading = false;
      }
    },

    async goToNextPage() {
      if (this.hasNextPage && !this.isLoading) {
        await this.fetchOrderHistory(this.currentPage + 1);
      }
    },

    async goToPreviousPage() {
      if (this.hasPreviousPage && !this.isLoading) {
        await this.fetchOrderHistory(this.currentPage - 1);
      }
    },

    async goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages && !this.isLoading) {
        await this.fetchOrderHistory(page);
      }
    },

    async refreshHistory() {
      await this.fetchOrderHistory(this.currentPage);
    },

    async cancelOrder(orderId: string) {
      try {
        this.error = null;
        await orderService.cancelOrder(orderId);
        await this.refreshHistory();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to cancel order';
        throw error;
      }
    },

    getOrderById(orderId: string): Order | undefined {
      return this.orders.find(o => o.id === orderId);
    },

    clearError() {
      this.error = null;
    }
  }
});
