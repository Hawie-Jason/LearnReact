<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p class="subtitle">Your train ticket has been booked successfully</p>

      <div v-if="order" class="booking-details">
        <div class="pnr-box">
          <div class="pnr-label">PNR Number</div>
          <div class="pnr-number">{{ order.pnr }}</div>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <div class="detail-icon">🚂</div>
            <div class="detail-content">
              <div class="detail-label">Train</div>
              <div class="detail-value">{{ order.train.name }}</div>
              <div class="detail-meta">{{ order.train.number }}</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">📍</div>
            <div class="detail-content">
              <div class="detail-label">Route</div>
              <div class="detail-value">{{ order.train.origin }}</div>
              <div class="detail-meta">to {{ order.train.destination }}</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">⏰</div>
            <div class="detail-content">
              <div class="detail-label">Departure</div>
              <div class="detail-value">{{ order.train.departureTime }}</div>
              <div class="detail-meta">{{ order.train.duration }}</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-icon">💺</div>
            <div class="detail-content">
              <div class="detail-label">Seats</div>
              <div class="detail-value">{{ formatClass(order.seatSelection.seatClass) }}</div>
              <div class="detail-meta">{{ order.seatSelection.passengers.length }} passenger(s)</div>
            </div>
          </div>
        </div>

        <div class="passengers-section">
          <h3>Passenger Details</h3>
          <div class="passengers-list">
            <div 
              v-for="(passenger, index) in order.seatSelection.passengers" 
              :key="passenger.id"
              class="passenger-card"
            >
              <div class="passenger-badge">{{ index + 1 }}</div>
              <div class="passenger-details">
                <div class="passenger-name">{{ passenger.name }}</div>
                <div class="passenger-info">
                  {{ passenger.age }} years • {{ formatGender(passenger.gender) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="payment-info">
          <div class="payment-row">
            <span>Order ID:</span>
            <strong>{{ order.id }}</strong>
          </div>
          <div class="payment-row">
            <span>Payment Status:</span>
            <span class="badge badge-success">{{ order.paymentStatus.toUpperCase() }}</span>
          </div>
          <div class="payment-row">
            <span>Total Paid:</span>
            <strong class="amount">₹{{ order.seatSelection.totalPrice }}</strong>
          </div>
        </div>

        <div class="notice-box">
          <strong>📧 Confirmation Sent</strong>
          <p>A confirmation email with your ticket details has been sent to your registered email address.</p>
        </div>
      </div>

      <div class="actions">
        <router-link to="/order-history" class="btn btn-outline">
          View Order History
        </router-link>
        <router-link to="/search" class="btn btn-primary" @click="resetBooking">
          Book Another Train
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { SeatClass } from '@/types';
import { useBookingStore } from '@/stores/bookingStore';
import { useOrderHistoryStore } from '@/stores/orderHistoryStore';

const router = useRouter();
const bookingStore = useBookingStore();
const orderHistoryStore = useOrderHistoryStore();

const order = computed(() => bookingStore.currentOrder);

onMounted(() => {
  if (!bookingStore.currentOrder || bookingStore.currentOrder.status !== 'confirmed') {
    router.push('/search');
  }
  orderHistoryStore.refreshHistory();
});

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function resetBooking() {
  bookingStore.resetBooking();
}
</script>

<style scoped>
.success-page {
  max-width: 800px;
  margin: 0 auto;
}

.success-container {
  background: white;
  border-radius: 0.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.booking-details {
  text-align: left;
  margin-bottom: 2rem;
}

.pnr-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.pnr-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.pnr-number {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.detail-icon {
  font-size: 2rem;
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.detail-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

.passengers-section {
  margin-bottom: 2rem;
}

.passengers-section h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #1f2937;
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

.passenger-badge {
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

.passenger-details {
  flex: 1;
}

.passenger-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.passenger-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.payment-info {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.payment-row:not(:last-child) {
  border-bottom: 1px solid #bfdbfe;
}

.amount {
  color: #3b82f6;
  font-size: 1.25rem;
}

.notice-box {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 0.375rem;
  padding: 1rem;
  text-align: left;
}

.notice-box strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #065f46;
}

.notice-box p {
  color: #065f46;
  font-size: 0.875rem;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 640px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
