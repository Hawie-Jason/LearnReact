<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal modal-large">
        <div class="modal-header">
          <h2>Order Details</h2>
          <button @click="close" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="details-section">
            <h3>Order Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Order ID:</span>
                <span class="value">{{ order.id }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Created:</span>
                <span class="value">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span class="badge" :class="getStatusBadgeClass(order.status)">
                  {{ order.status.toUpperCase() }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">Payment:</span>
                <span class="badge" :class="getPaymentBadgeClass(order.paymentStatus)">
                  {{ order.paymentStatus.toUpperCase() }}
                </span>
              </div>
              <div v-if="order.pnr" class="detail-item full-width">
                <span class="label">PNR:</span>
                <span class="value pnr">{{ order.pnr }}</span>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Train Details</h3>
            <div class="train-card">
              <div class="train-header-info">
                <div class="train-name">{{ order.train.name }}</div>
                <div class="train-number">{{ order.train.number }}</div>
              </div>
              <div class="route">
                <div class="station">
                  <div class="station-name">{{ order.train.origin }}</div>
                  <div class="station-time">{{ order.train.departureTime }}</div>
                </div>
                <div class="duration">
                  <div class="arrow">→</div>
                  <div>{{ order.train.duration }}</div>
                </div>
                <div class="station">
                  <div class="station-name">{{ order.train.destination }}</div>
                  <div class="station-time">{{ order.train.arrivalTime }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Seat Selection</h3>
            <div class="seat-info">
              <div class="seat-detail">
                <span class="label">Class:</span>
                <span class="value">{{ formatClass(order.seatSelection.seatClass) }}</span>
              </div>
              <div class="seat-detail">
                <span class="label">Passengers:</span>
                <span class="value">{{ order.seatSelection.passengers.length }}</span>
              </div>
              <div class="seat-detail">
                <span class="label">Total Price:</span>
                <span class="value price">₹{{ order.seatSelection.totalPrice }}</span>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Passengers</h3>
            <div class="passengers-list">
              <div 
                v-for="(passenger, index) in order.seatSelection.passengers" 
                :key="passenger.id"
                class="passenger-card"
              >
                <div class="passenger-number">{{ index + 1 }}</div>
                <div class="passenger-info">
                  <div class="passenger-name">{{ passenger.name }}</div>
                  <div class="passenger-details">
                    {{ passenger.age }} years • {{ formatGender(passenger.gender) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="close" class="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Order, SeatClass, OrderStatus, PaymentStatus } from '@/types';

defineProps<{
  order: Order;
}>();

const emit = defineEmits<{
  close: [];
}>();

function close() {
  emit('close');
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
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
</script>

<style scoped>
.modal-large {
  max-width: 800px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.btn-close:hover {
  color: #1f2937;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section:last-child {
  margin-bottom: 0;
}

.details-section h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-weight: 600;
  color: #1f2937;
}

.value.pnr {
  font-family: monospace;
  font-size: 1.25rem;
  color: #3b82f6;
  letter-spacing: 2px;
}

.train-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.375rem;
}

.train-header-info {
  margin-bottom: 1rem;
}

.train-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.train-number {
  color: #6b7280;
  font-size: 0.875rem;
}

.route {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.station {
  flex: 1;
}

.station-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.station-time {
  color: #6b7280;
  font-size: 0.875rem;
}

.duration {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.arrow {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.seat-info {
  display: flex;
  gap: 2rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
}

.seat-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price {
  color: #3b82f6;
  font-size: 1.25rem;
}

.passengers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.passenger-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.passenger-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.passenger-info {
  flex: 1;
}

.passenger-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.passenger-details {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .route {
    flex-direction: column;
  }
  
  .seat-info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
