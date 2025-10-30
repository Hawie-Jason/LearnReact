<template>
  <div class="failure-page">
    <div class="failure-container">
      <div class="failure-icon">✗</div>
      <h1>Payment Failed</h1>
      <p class="subtitle">We couldn't process your payment</p>

      <div v-if="order" class="failure-details">
        <div class="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-text">
            <strong>Payment Unsuccessful</strong>
            <p>{{ bookingStore.paymentResult?.message || 'Your payment could not be processed. Please try again.' }}</p>
          </div>
        </div>

        <div class="order-info">
          <h3>Order Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Order ID:</span>
              <span class="info-value">{{ order.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Train:</span>
              <span class="info-value">{{ order.train.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Route:</span>
              <span class="info-value">{{ order.train.origin }} → {{ order.train.destination }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Amount:</span>
              <span class="info-value">₹{{ order.seatSelection.totalPrice }}</span>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h3>What to do next?</h3>
          <ul class="help-list">
            <li>Check if you have sufficient balance in your account</li>
            <li>Verify your payment details are correct</li>
            <li>Try using a different payment method</li>
            <li>Contact your bank if the issue persists</li>
          </ul>
        </div>
      </div>

      <div class="actions">
        <router-link to="/search" class="btn btn-secondary" @click="resetBooking">
          Browse Trains
        </router-link>
        <router-link to="/payment" class="btn btn-primary">
          Try Again
        </router-link>
      </div>

      <div class="support-link">
        <p>Need help? <a href="#">Contact Support</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/bookingStore';

const router = useRouter();
const bookingStore = useBookingStore();

const order = computed(() => bookingStore.currentOrder);

onMounted(() => {
  if (!bookingStore.currentOrder || bookingStore.currentOrder.status !== 'failed') {
    router.push('/search');
  }
});

function resetBooking() {
  bookingStore.resetBooking();
}
</script>

<style scoped>
.failure-page {
  max-width: 800px;
  margin: 0 auto;
}

.failure-container {
  background: white;
  border-radius: 0.5rem;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.failure-icon {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
  animation: shakeIn 0.5s ease-out;
}

@keyframes shakeIn {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
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

.failure-details {
  text-align: left;
  margin-bottom: 2rem;
}

.error-message {
  display: flex;
  gap: 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.error-icon {
  font-size: 2rem;
}

.error-text {
  flex: 1;
}

.error-text strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #991b1b;
}

.error-text p {
  color: #991b1b;
  font-size: 0.875rem;
  margin: 0;
}

.order-info {
  background: #f9fafb;
  border-radius: 0.375rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.order-info h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-weight: 600;
  color: #1f2937;
}

.help-section {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 0.375rem;
  padding: 1.5rem;
}

.help-section h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.help-list {
  margin: 0;
  padding-left: 1.5rem;
  color: #1e40af;
}

.help-list li {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.help-list li:last-child {
  margin-bottom: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.support-link {
  color: #6b7280;
  font-size: 0.875rem;
}

.support-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.support-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
