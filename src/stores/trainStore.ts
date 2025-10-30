import { defineStore } from 'pinia';
import type { Train } from '@/types';
import { trainService } from '@/services/trainService';

interface TrainState {
  trains: Train[];
  watchlist: Train[];
  searchResults: Train[];
  selectedTrain: Train | null;
  isLoading: boolean;
  error: string | null;
}

export const useTrainStore = defineStore('train', {
  state: (): TrainState => ({
    trains: [],
    watchlist: [],
    searchResults: [],
    selectedTrain: null,
    isLoading: false,
    error: null
  }),

  getters: {
    hasResults: (state): boolean => state.searchResults.length > 0,
    
    hasWatchlist: (state): boolean => state.watchlist.length > 0
  },

  actions: {
    async loadAllTrains() {
      try {
        this.isLoading = true;
        this.error = null;
        this.trains = await trainService.getAllTrains();
        this.searchResults = this.trains;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load trains';
      } finally {
        this.isLoading = false;
      }
    },

    async searchTrains(origin?: string, destination?: string) {
      try {
        this.isLoading = true;
        this.error = null;
        this.searchResults = await trainService.searchTrains(origin, destination);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Search failed';
      } finally {
        this.isLoading = false;
      }
    },

    async loadWatchlist() {
      try {
        this.isLoading = true;
        this.error = null;
        this.watchlist = await trainService.getWatchlist();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load watchlist';
      } finally {
        this.isLoading = false;
      }
    },

    async addToWatchlist(trainId: string) {
      try {
        trainService.addToWatchlist(trainId);
        await this.loadWatchlist();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add to watchlist';
      }
    },

    async removeFromWatchlist(trainId: string) {
      try {
        trainService.removeFromWatchlist(trainId);
        await this.loadWatchlist();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove from watchlist';
      }
    },

    isInWatchlist(trainId: string): boolean {
      return trainService.isInWatchlist(trainId);
    },

    async getTrainById(id: string) {
      try {
        this.selectedTrain = await trainService.getTrainById(id);
        return this.selectedTrain;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get train';
        return null;
      }
    },

    async refreshAvailability() {
      await this.loadAllTrains();
      if (this.hasWatchlist) {
        await this.loadWatchlist();
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
