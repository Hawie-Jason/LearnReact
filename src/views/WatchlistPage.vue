<template>
  <div class="watchlist-page">
    <h1>My Watchlist</h1>

    <div v-if="trainStore.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading watchlist...</p>
    </div>

    <div v-else-if="trainStore.error" class="alert alert-error">
      {{ trainStore.error }}
    </div>

    <div v-else-if="!trainStore.hasWatchlist" class="empty-state">
      <div class="empty-icon">⭐</div>
      <h2>Your watchlist is empty</h2>
      <p>Add trains to your watchlist to quickly access them later</p>
      <router-link to="/search" class="btn btn-primary">
        Browse Trains
      </router-link>
    </div>

    <div v-else class="results">
      <div class="watchlist-header">
        <h2>Saved Trains ({{ trainStore.watchlist.length }})</h2>
        <button @click="refreshWatchlist" class="btn btn-outline">
          🔄 Refresh
        </button>
      </div>
      
      <div class="train-list">
        <TrainCard 
          v-for="train in trainStore.watchlist" 
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
import { onMounted } from 'vue';
import type { Train } from '@/types';
import { useTrainStore } from '@/stores/trainStore';
import { useBookingStore } from '@/stores/bookingStore';
import TrainCard from '@/components/TrainCard.vue';

const trainStore = useTrainStore();
const bookingStore = useBookingStore();

onMounted(() => {
  trainStore.loadWatchlist();
});

async function refreshWatchlist() {
  await trainStore.refreshAvailability();
  await trainStore.loadWatchlist();
}

function handleBookNow(train: Train) {
  bookingStore.startBooking(train);
}

function handleQuickBook(train: Train) {
  bookingStore.quickBook(train, 1, 'economy');
}
</script>

<style scoped>
.watchlist-page {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
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

.watchlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.watchlist-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
}

.train-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
