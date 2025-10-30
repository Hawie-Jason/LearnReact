<template>
  <div class="search-page">
    <h1>Search Trains</h1>

    <div class="search-form card">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Origin</label>
          <input 
            v-model="searchOrigin" 
            type="text" 
            class="form-input"
            placeholder="e.g., New Delhi"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Destination</label>
          <input 
            v-model="searchDestination" 
            type="text" 
            class="form-input"
            placeholder="e.g., Mumbai"
          >
        </div>

        <div class="form-group">
          <button @click="search" class="btn btn-primary search-btn">
            Search
          </button>
        </div>
      </div>
    </div>

    <div v-if="trainStore.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Searching trains...</p>
    </div>

    <div v-else-if="trainStore.error" class="alert alert-error">
      {{ trainStore.error }}
    </div>

    <div v-else-if="!trainStore.hasResults" class="empty-state">
      <p>No trains found. Try different search criteria.</p>
    </div>

    <div v-else class="results">
      <h2>Available Trains ({{ trainStore.searchResults.length }})</h2>
      <div class="train-list">
        <TrainCard 
          v-for="train in trainStore.searchResults" 
          :key="train.id"
          :train="train"
          @book-now="handleBookNow"
          @quick-book="handleQuickBook"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Train } from '@/types';
import { useTrainStore } from '@/stores/trainStore';
import { useBookingStore } from '@/stores/bookingStore';
import TrainCard from '@/components/TrainCard.vue';

const trainStore = useTrainStore();
const bookingStore = useBookingStore();

const searchOrigin = ref('');
const searchDestination = ref('');

onMounted(() => {
  trainStore.loadAllTrains();
});

async function search() {
  await trainStore.searchTrains(searchOrigin.value, searchDestination.value);
}

function handleBookNow(train: Train) {
  bookingStore.startBooking(train);
}

function handleQuickBook(train: Train) {
  bookingStore.quickBook(train, 1, 'economy');
}
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1f2937;
}

.search-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.search-btn {
  height: 38px;
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
  padding: 3rem;
  color: #6b7280;
}

.results h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.train-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
