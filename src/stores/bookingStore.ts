import { defineStore } from 'pinia';
import type { Train, SeatSelection, Order, Passenger, SeatClass, PaymentResult } from '@/types';
import { orderService } from '@/services/orderService';

interface BookingState {
  selectedTrain: Train | null;
  seatSelection: SeatSelection | null;
  currentOrder: Order | null;
  isBooking: boolean;
  isProcessingPayment: boolean;
  error: string | null;
  paymentResult: PaymentResult | null;
  showSeatSelectionDialog: boolean;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    selectedTrain: null,
    seatSelection: null,
    currentOrder: null,
    isBooking: false,
    isProcessingPayment: false,
    error: null,
    paymentResult: null,
    showSeatSelectionDialog: false
  }),

  getters: {
    hasSelection: (state): boolean => {
      return !!state.selectedTrain && !!state.seatSelection;
    },

    totalPassengers: (state): number => {
      return state.seatSelection?.passengers.length || 0;
    },

    canProceedToPayment: (state): boolean => {
      return !!(
        state.currentOrder &&
        state.currentOrder.status === 'pending' &&
        !state.isProcessingPayment
      );
    }
  },

  actions: {
    async startBooking(train: Train) {
      this.selectedTrain = train;
      this.seatSelection = null;
      this.currentOrder = null;
      this.error = null;
      this.paymentResult = null;
      this.showSeatSelectionDialog = true;
    },

    async quickBook(train: Train, passengerCount: number = 1, seatClass: SeatClass = 'economy') {
      try {
        this.isBooking = true;
        this.error = null;

        const conflict = await orderService.checkAvailabilityConflict(
          train.id,
          seatClass,
          passengerCount
        );

        if (conflict) {
          this.error = `Insufficient seats. Only ${conflict.available} seats available in ${seatClass} class.`;
          return false;
        }

        this.selectedTrain = train;
        
        const passengers: Passenger[] = Array.from({ length: passengerCount }, (_, i) => ({
          id: `P${Date.now()}${i}`,
          name: `Passenger ${i + 1}`,
          age: 30,
          gender: 'other' as const
        }));

        this.seatSelection = {
          seatClass,
          passengers,
          totalPrice: train.price[seatClass] * passengerCount
        };

        this.showSeatSelectionDialog = true;
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to start quick booking';
        return false;
      } finally {
        this.isBooking = false;
      }
    },

    async updateSeatSelection(seatClass: SeatClass, passengers: Passenger[]) {
      if (!this.selectedTrain) {
        this.error = 'No train selected';
        return false;
      }

      try {
        this.error = null;

        const conflict = await orderService.checkAvailabilityConflict(
          this.selectedTrain.id,
          seatClass,
          passengers.length
        );

        if (conflict) {
          this.error = `Insufficient seats. Only ${conflict.available} seats available in ${seatClass} class.`;
          return false;
        }

        this.seatSelection = {
          seatClass,
          passengers,
          totalPrice: this.selectedTrain.price[seatClass] * passengers.length
        };

        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update seat selection';
        return false;
      }
    },

    closeSeatSelectionDialog() {
      this.showSeatSelectionDialog = false;
    },

    async createOrder() {
      if (!this.selectedTrain || !this.seatSelection) {
        this.error = 'Missing train or seat selection';
        return null;
      }

      try {
        this.isBooking = true;
        this.error = null;

        const order = await orderService.createOrder(this.selectedTrain, this.seatSelection);
        this.currentOrder = order;
        this.showSeatSelectionDialog = false;
        return order;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create order';
        return null;
      } finally {
        this.isBooking = false;
      }
    },

    async processPayment(simulateFailure?: boolean) {
      if (!this.currentOrder) {
        this.error = 'No order to process';
        return null;
      }

      try {
        this.isProcessingPayment = true;
        this.error = null;
        this.paymentResult = null;

        const result = await orderService.processPayment(this.currentOrder.id, simulateFailure);
        this.paymentResult = result;

        if (result.success) {
          const updatedOrder = await orderService.getOrderById(this.currentOrder.id);
          if (updatedOrder) {
            this.currentOrder = updatedOrder;
          }
        }

        return result;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Payment processing failed';
        return null;
      } finally {
        this.isProcessingPayment = false;
      }
    },

    async updatePassengerDetails(passengerId: string, updates: Partial<Passenger>) {
      if (!this.seatSelection) return false;

      const passenger = this.seatSelection.passengers.find(p => p.id === passengerId);
      if (!passenger) return false;

      Object.assign(passenger, updates);
      return true;
    },

    async updateSeatClass(newSeatClass: SeatClass) {
      if (!this.selectedTrain || !this.seatSelection) return false;

      const conflict = await orderService.checkAvailabilityConflict(
        this.selectedTrain.id,
        newSeatClass,
        this.seatSelection.passengers.length
      );

      if (conflict) {
        this.error = `Insufficient seats. Only ${conflict.available} seats available in ${newSeatClass} class.`;
        return false;
      }

      this.seatSelection.seatClass = newSeatClass;
      this.seatSelection.totalPrice = 
        this.selectedTrain.price[newSeatClass] * this.seatSelection.passengers.length;
      
      this.error = null;
      return true;
    },

    resetBooking() {
      this.selectedTrain = null;
      this.seatSelection = null;
      this.currentOrder = null;
      this.error = null;
      this.paymentResult = null;
      this.showSeatSelectionDialog = false;
    },

    clearError() {
      this.error = null;
    }
  }
});
