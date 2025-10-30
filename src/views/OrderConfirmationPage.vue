<template>
  <div class="order-confirmation-page">
    <div v-if="!bookingStore.currentOrder" class="empty-state">
      <p>No order found. Please start a new booking.</p>
      <router-link to="/search" class="btn btn-primary">
        Search Trains
      </router-link>
    </div>

    <div v-else class="confirmation-content">
      <h1>Order Confirmation</h1>
      <p class="subtitle">Review your booking details before proceeding to payment</p>

      <div v-if="bookingStore.error" class="alert alert-error">
        {{ bookingStore.error }}
      </div>

      <div class="order-details">
        <section class="details-section">
          <div class="section-header">
            <h2>Train Details</h2>
            <button @click="editTrain" class="btn-edit">Edit</button>
          </div>
          <div class="details-card">
            <div class="detail-row">
              <span class="label">Train:</span>
              <span class="value">{{ order.train.name }} ({{ order.train.number }})</span>
            </div>
            <div class="detail-row">
              <span class="label">Route:</span>
              <span class="value">{{ order.train.origin }} → {{ order.train.destination }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Departure:</span>
              <span class="value">{{ order.train.departureTime }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Arrival:</span>
              <span class="value">{{ order.train.arrivalTime }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">{{ order.train.duration }}</span>
            </div>
          </div>
        </section>

        <section class="details-section">
          <div class="section-header">
            <h2>Seat Selection</h2>
            <button @click="editSeats" class="btn-edit">Edit</button>
          </div>
          <div class="details-card">
            <div class="detail-row">
              <span class="label">Class:</span>
              <span class="value">{{ formatClass(order.seatSelection.seatClass) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Passengers:</span>
              <span class="value">{{ order.seatSelection.passengers.length }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Price per seat:</span>
              <span class="value">₹{{ order.train.price[order.seatSelection.seatClass] }}</span>
            </div>
          </div>
        </section>

        <section class="details-section">
          <div class="section-header">
            <h2>Passenger Details</h2>
            <button @click="editPassengers" class="btn-edit">Edit</button>
          </div>
          <div class="details-card">
            <div 
              v-for="(passenger, index) in order.seatSelection.passengers" 
              :key="passenger.id"
              class="passenger-item"
            >
              <div class="passenger-number">{{ index + 1 }}</div>
              <div class="passenger-info">
                <div class="passenger-name">{{ passenger.name }}</div>
                <div class="passenger-meta">
                  {{ passenger.age }} years, {{ formatGender(passenger.gender) }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="details-section">
          <h2>Order Summary</h2>
          <div class="details-card summary-card">
            <div class="summary-row">
              <span>Order ID:</span>
              <strong>{{ order.id }}</strong>
            </div>
            <div class="summary-row">
              <span>Date:</span>
              <strong>{{ formatDate(order.createdAt) }}</strong>
            </div>
            <div class="summary-row">
              <span>Status:</span>
              <span class="badge badge-warning">{{ order.status.toUpperCase() }}</span>
            </div>
            <div class="summary-row total">
              <span>Total Amount:</span>
              <strong class="total-price">₹{{ order.seatSelection.totalPrice }}</strong>
            </div>
          </div>
        </section>
      </div>

      <div class="actions">
        <button @click="cancel" class="btn btn-secondary">
          Cancel Booking
        </button>
        <button @click="proceedToPayment" class="btn btn-primary btn-large">
          Proceed to Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { SeatClass } from '@/types';
import { useBookingStore } from '@/stores/bookingStore';

const router = useRouter();
const bookingStore = useBookingStore();

const order = computed(() => bookingStore.currentOrder);

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function editTrain() {
  router.push('/search');
}

function editSeats() {
  if (bookingStore.currentOrder) {
    bookingStore.showSeatSelectionDialog = true;
  }
}

function editPassengers() {
  if (bookingStore.currentOrder) {
    bookingStore.showSeatSelectionDialog = true;
  }
}

function cancel() {
  bookingStore.resetBooking();
  router.push('/search');
}

function proceedToPayment() {
  router.push('/payment');
}
</script>

<style scoped>
.order-confirmation-page {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
}

.confirmation-content {
  padding-bottom: 2rem;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.details-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  color: #1f2937;
}

.btn-edit {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.btn-edit:hover {
  text-decoration: underline;
}

.details-card {
  background: #f9fafb;
  border-radius: 0.375rem;
  padding: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.label {
  color: #6b7280;
  font-size: 0.875rem;
}

.value {
  color: #1f2937;
  font-weight: 500;
}

.passenger-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.passenger-item:last-child {
  margin-bottom: 0;
}

.passenger-number {
  width: 2rem;
  height: 2rem;
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
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.passenger-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-card {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid #bfdbfe;
}

.summary-row.total {
  border-top: 2px solid #3b82f6;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.125rem;
}

.total-price {
  color: #3b82f6;
  font-size: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}
</style>
