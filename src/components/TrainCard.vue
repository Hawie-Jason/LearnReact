<template>
  <div class="train-card">
    <div class="train-header">
      <div class="train-info">
        <h3 class="train-name">{{ train.name }}</h3>
        <p class="train-number">{{ train.number }}</p>
      </div>
      <button 
        @click="toggleWatchlist" 
        class="watchlist-btn"
        :class="{ active: isWatchlisted }"
      >
        {{ isWatchlisted ? '★' : '☆' }}
      </button>
    </div>

    <div class="route-info">
      <div class="station">
        <p class="station-name">{{ train.origin }}</p>
        <p class="time">{{ train.departureTime }}</p>
      </div>
      <div class="duration">
        <div class="arrow">→</div>
        <p>{{ train.duration }}</p>
      </div>
      <div class="station">
        <p class="station-name">{{ train.destination }}</p>
        <p class="time">{{ train.arrivalTime }}</p>
      </div>
    </div>

    <div class="seat-classes">
      <div 
        v-for="seatClass in seatClasses" 
        :key="seatClass"
        class="seat-class"
      >
        <div class="class-info">
          <span class="class-name">{{ formatClass(seatClass) }}</span>
          <span class="availability" :class="getAvailabilityClass(seatClass)">
            {{ train.availability[seatClass] }} seats
          </span>
        </div>
        <div class="price">₹{{ train.price[seatClass] }}</div>
      </div>
    </div>

    <div class="actions">
      <button @click="onBookNow" class="btn btn-primary">
        Book Now
      </button>
      <button @click="onQuickBook" class="btn btn-outline">
        Quick Book
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Train, SeatClass } from '@/types';
import { useTrainStore } from '@/stores/trainStore';

const props = defineProps<{
  train: Train;
}>();

const emit = defineEmits<{
  bookNow: [train: Train];
  quickBook: [train: Train];
}>();

const trainStore = useTrainStore();

const seatClasses: SeatClass[] = ['economy', 'business', 'first'];

const isWatchlisted = computed(() => trainStore.isInWatchlist(props.train.id));

function formatClass(seatClass: SeatClass): string {
  return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
}

function getAvailabilityClass(seatClass: SeatClass): string {
  const available = props.train.availability[seatClass];
  if (available === 0) return 'unavailable';
  if (available < 10) return 'low';
  return 'available';
}

function toggleWatchlist() {
  if (isWatchlisted.value) {
    trainStore.removeFromWatchlist(props.train.id);
  } else {
    trainStore.addToWatchlist(props.train.id);
  }
}

function onBookNow() {
  emit('bookNow', props.train);
}

function onQuickBook() {
  emit('quickBook', props.train);
}
</script>

<style scoped>
.train-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.train-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.train-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.train-info {
  flex: 1;
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

.watchlist-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #d1d5db;
  transition: color 0.2s;
}

.watchlist-btn:hover,
.watchlist-btn.active {
  color: #f59e0b;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.station {
  flex: 1;
}

.station-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.time {
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

.seat-classes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.seat-class {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.class-name {
  font-weight: 500;
  color: #1f2937;
}

.availability {
  font-size: 0.75rem;
}

.availability.available {
  color: #10b981;
}

.availability.low {
  color: #f59e0b;
}

.availability.unavailable {
  color: #ef4444;
}

.price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
}

.actions {
  display: flex;
  gap: 1rem;
}

.actions button {
  flex: 1;
}
</style>
