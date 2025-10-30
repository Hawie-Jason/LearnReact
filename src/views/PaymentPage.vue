<template>
  <div class="payment-page">
    <div v-if="!bookingStore.currentOrder" class="empty-state">
      <p>No order found. Please start a new booking.</p>
      <router-link to="/search" class="btn btn-primary">
        Search Trains
      </router-link>
    </div>

    <div v-else class="payment-content">
      <h1>Payment</h1>
      <p class="subtitle">Complete your payment to confirm your booking</p>

      <div class="payment-container">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-details">
            <div class="summary-item">
              <span>Train:</span>
              <strong>{{ order.train.name }}</strong>
            </div>
            <div class="summary-item">
              <span>Route:</span>
              <strong>{{ order.train.origin }} → {{ order.train.destination }}</strong>
            </div>
            <div class="summary-item">
              <span>Class:</span>
              <strong>{{ formatClass(order.seatSelection.seatClass) }}</strong>
            </div>
            <div class="summary-item">
              <span>Passengers:</span>
              <strong>{{ order.seatSelection.passengers.length }}</strong>
            </div>
            <div class="summary-item total">
              <span>Total Amount:</span>
              <strong class="amount">₹{{ order.seatSelection.totalPrice }}</strong>
            </div>
          </div>
        </div>

        <div class="payment-form">
          <h2>Payment Method</h2>
          
          <div v-if="!isProcessing && !paymentCompleted" class="payment-options">
            <div class="payment-option" :class="{ selected: paymentMethod === 'card' }">
              <input 
                type="radio" 
                id="card" 
                value="card" 
                v-model="paymentMethod"
              >
              <label for="card">
                <div class="option-icon">💳</div>
                <div class="option-text">
                  <strong>Credit/Debit Card</strong>
                  <p>Pay securely with your card</p>
                </div>
              </label>
            </div>

            <div class="payment-option" :class="{ selected: paymentMethod === 'upi' }">
              <input 
                type="radio" 
                id="upi" 
                value="upi" 
                v-model="paymentMethod"
              >
              <label for="upi">
                <div class="option-icon">📱</div>
                <div class="option-text">
                  <strong>UPI</strong>
                  <p>Pay using UPI apps</p>
                </div>
              </label>
            </div>

            <div class="payment-option" :class="{ selected: paymentMethod === 'wallet' }">
              <input 
                type="radio" 
                id="wallet" 
                value="wallet" 
                v-model="paymentMethod"
              >
              <label for="wallet">
                <div class="option-icon">👛</div>
                <div class="option-text">
                  <strong>Wallet</strong>
                  <p>Pay from your wallet balance</p>
                </div>
              </label>
            </div>
          </div>

          <div v-if="isProcessing" class="processing-state">
            <div class="loading-spinner"></div>
            <h3>Processing Payment...</h3>
            <p>Please wait while we process your payment</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <div v-if="!isProcessing && !paymentCompleted" class="simulation-controls">
            <div class="info-box">
              <strong>🎭 Payment Simulation</strong>
              <p>This is a simulated payment. Choose an outcome:</p>
            </div>
            
            <div class="action-buttons">
              <button @click="processPayment(false)" class="btn btn-success btn-large">
                ✓ Simulate Success
              </button>
              <button @click="processPayment(true)" class="btn btn-danger btn-large">
                ✗ Simulate Failure
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="back-link">
        <router-link to="/order-confirmation" class="btn btn-secondary">
          ← Back to Confirmation
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { SeatClass } from '@/types';
import { useBookingStore } from '@/stores/bookingStore';

const router = useRouter();
const bookingStore = useBookingStore();

const paymentMethod = ref('card');
const isProcessing = ref(false);
const paymentCompleted = ref(false);
const progress = ref(0);

const order = computed(() => bookingStore.currentOrder);

onMounted(() => {
  if (!bookingStore.currentOrder || bookingStore.currentOrder.status !== 'pending') {
    router.push('/search');
  }
});

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

async function processPayment(simulateFailure: boolean) {
  isProcessing.value = true;
  progress.value = 0;

  const progressInterval = setInterval(() => {
    if (progress.value < 95) {
      progress.value += 5;
    }
  }, 100);

  try {
    const result = await bookingStore.processPayment(simulateFailure);
    
    clearInterval(progressInterval);
    progress.value = 100;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    paymentCompleted.value = true;
    
    if (result?.success) {
      router.push('/order-success');
    } else {
      router.push('/order-failure');
    }
  } catch (error) {
    clearInterval(progressInterval);
    console.error('Payment error:', error);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<style scoped>
.payment-page {
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

.payment-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.order-summary,
.payment-form {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-summary h2,
.payment-form h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.summary-item.total {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  font-size: 1.125rem;
  margin-top: 0.5rem;
}

.amount {
  color: #3b82f6;
  font-size: 1.5rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-option {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.payment-option.selected {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.payment-option label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.payment-option input[type="radio"] {
  margin-right: 0.5rem;
}

.option-icon {
  font-size: 2rem;
}

.option-text strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.option-text p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.processing-state {
  text-align: center;
  padding: 2rem;
}

.processing-state .loading-spinner {
  margin: 0 auto 1rem;
}

.processing-state h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.processing-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.simulation-controls {
  margin-top: 2rem;
}

.info-box {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-box strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #92400e;
}

.info-box p {
  color: #92400e;
  font-size: 0.875rem;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-large {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  justify-content: center;
}

.back-link {
  text-align: center;
}

@media (max-width: 768px) {
  .payment-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
