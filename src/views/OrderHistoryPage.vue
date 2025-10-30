<template>
  <div class="order-history-page">
    <div class="page-header">
      <h1>Order History</h1>
      <button @click="refresh" class="btn btn-outline" :disabled="orderHistoryStore.isLoading">
        🔄 Refresh
      </button>
    </div>

    <div v-if="orderHistoryStore.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading order history...</p>
    </div>

    <div v-else-if="orderHistoryStore.error" class="alert alert-error">
      {{ orderHistoryStore.error }}
    </div>

    <div v-else-if="!orderHistoryStore.hasOrders" class="empty-state">
      <div class="empty-icon">📋</div>
      <h2>No Orders Yet</h2>
      <p>You haven't made any bookings yet</p>
      <router-link to="/search" class="btn btn-primary">
        Start Booking
      </router-link>
    </div>

    <div v-else class="orders-container">
      <div class="orders-info">
        <p>Total Orders: {{ orderHistoryStore.totalOrders }}</p>
      </div>

      <div class="orders-list">
        <div 
          v-for="order in orderHistoryStore.orders" 
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-id-section">
              <div class="order-id">{{ order.id }}</div>
              <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="order-badges">
              <span class="badge" :class="getStatusBadgeClass(order.status)">
                {{ order.status.toUpperCase() }}
              </span>
              <span class="badge" :class="getPaymentBadgeClass(order.paymentStatus)">
                {{ order.paymentStatus.toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="order-body">
            <div class="train-info">
              <div class="train-icon">🚂</div>
              <div class="train-details">
                <div class="train-name">{{ order.train.name }}</div>
                <div class="train-number">{{ order.train.number }}</div>
              </div>
            </div>

            <div class="route-info">
              <div class="route-station">
                <div class="station-name">{{ order.train.origin }}</div>
                <div class="station-time">{{ order.train.departureTime }}</div>
              </div>
              <div class="route-arrow">→</div>
              <div class="route-station">
                <div class="station-name">{{ order.train.destination }}</div>
                <div class="station-time">{{ order.train.arrivalTime }}</div>
              </div>
            </div>

            <div class="booking-info">
              <div class="info-item">
                <span class="info-icon">💺</span>
                <span class="info-text">
                  {{ formatClass(order.seatSelection.seatClass) }} Class
                </span>
              </div>
              <div class="info-item">
                <span class="info-icon">👥</span>
                <span class="info-text">
                  {{ order.seatSelection.passengers.length }} Passenger(s)
                </span>
              </div>
              <div class="info-item">
                <span class="info-icon">💰</span>
                <span class="info-text">
                  ₹{{ order.seatSelection.totalPrice }}
                </span>
              </div>
            </div>

            <div v-if="order.pnr" class="pnr-section">
              <span class="pnr-label">PNR:</span>
              <span class="pnr-value">{{ order.pnr }}</span>
            </div>
          </div>

          <div class="order-footer">
            <button 
              @click="viewDetails(order)" 
              class="btn btn-outline btn-small"
            >
              View Details
            </button>
            <button 
              v-if="order.status === 'confirmed'"
              @click="cancelOrder(order.id)" 
              class="btn btn-danger btn-small"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      <div v-if="orderHistoryStore.totalPages > 1" class="pagination">
        <button 
          @click="orderHistoryStore.goToPreviousPage()"
          :disabled="!orderHistoryStore.hasPreviousPage || orderHistoryStore.isLoading"
          class="btn btn-secondary"
        >
          ← Previous
        </button>
        
        <div class="page-info">
          Page {{ orderHistoryStore.currentPage }} of {{ orderHistoryStore.totalPages }}
        </div>

        <button 
          @click="orderHistoryStore.goToNextPage()"
          :disabled="!orderHistoryStore.hasNextPage || orderHistoryStore.isLoading"
          class="btn btn-secondary"
        >
          Next →
        </button>
      </div>
    </div>

    <OrderDetailsModal 
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="closeDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Order, SeatClass, OrderStatus, PaymentStatus } from '@/types';
import { useOrderHistoryStore } from '@/stores/orderHistoryStore';
import OrderDetailsModal from '@/components/OrderDetailsModal.vue';

const orderHistoryStore = useOrderHistoryStore();
const selectedOrder = ref<Order | null>(null);

onMounted(() => {
  orderHistoryStore.fetchOrderHistory();
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'confirmed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'failed':
      return 'badge-danger';
    case 'cancelled':
      return 'badge-info';
    default:
      return '';
  }
}

function getPaymentBadgeClass(paymentStatus: PaymentStatus): string {
  switch (paymentStatus) {
    case 'success':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'failed':
      return 'badge-danger';
    default:
      return '';
  }
}

function refresh() {
  orderHistoryStore.refreshHistory();
}

function viewDetails(order: Order) {
  selectedOrder.value = order;
}

function closeDetails() {
  selectedOrder.value = null;
}

async function cancelOrder(orderId: string) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    try {
      await orderHistoryStore.cancelOrder(orderId);
      alert('Order cancelled successfully');
    } catch (error) {
      alert('Failed to cancel order');
    }
  }
}
</script>

<style scoped>
.order-history-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #1f2937;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  margin: 0 auto 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.orders-info {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.orders-info p {
  margin: 0;
  color: #6b7280;
  font-weight: 500;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.order-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.order-id-section {
  flex: 1;
}

.order-id {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.order-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-badges {
  display: flex;
  gap: 0.5rem;
}

.order-body {
  padding: 1.5rem;
}

.train-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.train-icon {
  font-size: 2rem;
}

.train-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.train-number {
  font-size: 0.875rem;
  color: #6b7280;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.route-station {
  flex: 1;
}

.station-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.station-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.route-arrow {
  font-size: 1.5rem;
  color: #6b7280;
}

.booking-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  font-size: 1.25rem;
}

.info-text {
  font-size: 0.875rem;
  color: #1f2937;
}

.pnr-section {
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  display: flex;
  gap: 0.5rem;
}

.pnr-label {
  font-weight: 600;
  color: #1e40af;
}

.pnr-value {
  color: #1e40af;
  font-family: monospace;
  letter-spacing: 1px;
}

.order-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
}

.page-info {
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-info {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .order-footer {
    flex-direction: column;
  }
}
</style>
