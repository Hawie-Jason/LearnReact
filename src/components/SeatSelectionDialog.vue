<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="bookingStore.showSeatSelectionDialog" class="modal-overlay" @click.self="close">
        <div class="modal">
          <div class="modal-header">
            <h2>Select Passengers and Seats</h2>
            <button @click="close" class="btn-close">&times;</button>
          </div>

          <div class="modal-body">
            <div v-if="bookingStore.error" class="alert alert-error">
              {{ bookingStore.error }}
            </div>

            <div v-if="bookingStore.selectedTrain" class="train-summary">
              <h3>{{ bookingStore.selectedTrain.name }}</h3>
              <p>{{ bookingStore.selectedTrain.origin }} → {{ bookingStore.selectedTrain.destination }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Seat Class</label>
              <select v-model="selectedClass" class="form-select" @change="onClassChange">
                <option value="economy">Economy - ₹{{ trainPrice.economy }}</option>
                <option value="business">Business - ₹{{ trainPrice.business }}</option>
                <option value="first">First Class - ₹{{ trainPrice.first }}</option>
              </select>
              <p class="availability-info">
                {{ availableSeats }} seats available
              </p>
            </div>

            <div class="form-group">
              <label class="form-label">Number of Passengers</label>
              <input 
                v-model.number="passengerCount" 
                type="number" 
                min="1" 
                :max="Math.min(availableSeats, 6)"
                class="form-input"
                @input="updatePassengerCount"
              >
            </div>

            <div v-for="(passenger, index) in passengers" :key="passenger.id" class="passenger-form">
              <h4>Passenger {{ index + 1 }}</h4>
              
              <div class="form-group">
                <label class="form-label">Name</label>
                <input 
                  v-model="passenger.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Full name"
                >
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Age</label>
                  <input 
                    v-model.number="passenger.age" 
                    type="number" 
                    min="1" 
                    max="120"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select v-model="passenger.gender" class="form-select">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="price-summary">
              <div class="summary-row">
                <span>Seat Class:</span>
                <strong>{{ formatClass(selectedClass) }}</strong>
              </div>
              <div class="summary-row">
                <span>Passengers:</span>
                <strong>{{ passengers.length }}</strong>
              </div>
              <div class="summary-row">
                <span>Price per seat:</span>
                <strong>₹{{ trainPrice[selectedClass] }}</strong>
              </div>
              <div class="summary-row total">
                <span>Total Price:</span>
                <strong>₹{{ totalPrice }}</strong>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="close" class="btn btn-secondary">
              Cancel
            </button>
            <button 
              @click="confirmSelection" 
              class="btn btn-primary"
              :disabled="!canConfirm || bookingStore.isBooking"
            >
              {{ bookingStore.isBooking ? 'Processing...' : 'Proceed to Confirmation' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Passenger, SeatClass } from '@/types';
import { useBookingStore } from '@/stores/bookingStore';

const router = useRouter();
const bookingStore = useBookingStore();

const selectedClass = ref<SeatClass>('economy');
const passengerCount = ref(1);
const passengers = ref<Passenger[]>([]);

const trainPrice = computed(() => {
  if (!bookingStore.selectedTrain) {
    return { economy: 0, business: 0, first: 0 };
  }
  return bookingStore.selectedTrain.price;
});

const availableSeats = computed(() => {
  if (!bookingStore.selectedTrain) return 0;
  return bookingStore.selectedTrain.availability[selectedClass.value];
});

const totalPrice = computed(() => {
  return trainPrice.value[selectedClass.value] * passengers.value.length;
});

const canConfirm = computed(() => {
  return passengers.value.length > 0 && 
         passengers.value.every(p => p.name.trim().length > 0 && p.age > 0);
});

watch(() => bookingStore.showSeatSelectionDialog, (show) => {
  if (show && bookingStore.seatSelection) {
    selectedClass.value = bookingStore.seatSelection.seatClass;
    passengers.value = [...bookingStore.seatSelection.passengers];
    passengerCount.value = passengers.value.length;
  } else if (show) {
    initializePassengers();
  }
});

function initializePassengers() {
  passengers.value = Array.from({ length: passengerCount.value }, (_, i) => ({
    id: `P${Date.now()}${i}`,
    name: '',
    age: 30,
    gender: 'other' as const
  }));
}

function updatePassengerCount() {
  const count = Math.max(1, Math.min(passengerCount.value, availableSeats.value, 6));
  passengerCount.value = count;
  
  if (passengers.value.length < count) {
    const toAdd = count - passengers.value.length;
    for (let i = 0; i < toAdd; i++) {
      passengers.value.push({
        id: `P${Date.now()}${passengers.value.length}`,
        name: '',
        age: 30,
        gender: 'other'
      });
    }
  } else if (passengers.value.length > count) {
    passengers.value = passengers.value.slice(0, count);
  }
}

async function onClassChange() {
  if (!bookingStore.selectedTrain) return;
  
  bookingStore.clearError();
  const available = bookingStore.selectedTrain.availability[selectedClass.value];
  
  if (passengers.value.length > available) {
    passengerCount.value = Math.min(available, 6);
    updatePassengerCount();
  }
}

async function confirmSelection() {
  const success = await bookingStore.updateSeatSelection(selectedClass.value, passengers.value);
  
  if (success) {
    const order = await bookingStore.createOrder();
    if (order) {
      router.push('/order-confirmation');
    }
  }
}

function close() {
  bookingStore.closeSeatSelectionDialog();
}

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

initializePassengers();
</script>

<style scoped>
.modal-overlay {
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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

.train-summary {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.train-summary h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.train-summary p {
  color: #6b7280;
  font-size: 0.875rem;
}

.availability-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.passenger-form {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.passenger-form h4 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.price-summary {
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 0.375rem;
  border: 1px solid #bfdbfe;
  margin-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-row.total {
  border-top: 2px solid #3b82f6;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.125rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
