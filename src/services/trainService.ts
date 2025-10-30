import type { Train } from '@/types';
import { orderService } from './orderService';

const mockTrains: Train[] = [
  {
    id: 'T001',
    number: '12301',
    name: 'Rajdhani Express',
    origin: 'New Delhi',
    destination: 'Mumbai',
    departureTime: '16:00',
    arrivalTime: '08:35',
    duration: '16h 35m',
    price: {
      economy: 1200,
      business: 2500,
      first: 4000
    },
    availability: {
      economy: 50,
      business: 20,
      first: 10
    }
  },
  {
    id: 'T002',
    number: '12951',
    name: 'Mumbai Rajdhani',
    origin: 'Mumbai',
    destination: 'New Delhi',
    departureTime: '17:20',
    arrivalTime: '09:15',
    duration: '15h 55m',
    price: {
      economy: 1150,
      business: 2400,
      first: 3800
    },
    availability: {
      economy: 45,
      business: 15,
      first: 8
    }
  },
  {
    id: 'T003',
    number: '12259',
    name: 'Duronto Express',
    origin: 'Sealdah',
    destination: 'New Delhi',
    departureTime: '20:00',
    arrivalTime: '13:30',
    duration: '17h 30m',
    price: {
      economy: 1000,
      business: 2100,
      first: 3500
    },
    availability: {
      economy: 60,
      business: 25,
      first: 12
    }
  },
  {
    id: 'T004',
    number: '12431',
    name: 'Rajdhani Express',
    origin: 'New Delhi',
    destination: 'Bangalore',
    departureTime: '19:00',
    arrivalTime: '06:00',
    duration: '34h 00m',
    price: {
      economy: 1800,
      business: 3500,
      first: 5500
    },
    availability: {
      economy: 40,
      business: 18,
      first: 9
    }
  },
  {
    id: 'T005',
    number: '12649',
    name: 'Sampark Kranti',
    origin: 'Chennai',
    destination: 'New Delhi',
    departureTime: '11:00',
    arrivalTime: '06:45',
    duration: '28h 45m',
    price: {
      economy: 1500,
      business: 3000,
      first: 4800
    },
    availability: {
      economy: 55,
      business: 22,
      first: 11
    }
  }
];

class TrainService {
  private watchlist: Set<string> = new Set();

  constructor() {
    this.initializeAvailability();
  }

  private initializeAvailability(): void {
    mockTrains.forEach(train => {
      orderService.initializeTrainAvailability(train);
    });
  }

  async searchTrains(origin?: string, destination?: string): Promise<Train[]> {
    await this.delay(500);

    let results = [...mockTrains];

    if (origin) {
      results = results.filter(t => 
        t.origin.toLowerCase().includes(origin.toLowerCase())
      );
    }

    if (destination) {
      results = results.filter(t => 
        t.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    return results.map(train => ({
      ...train,
      availability: orderService.getAvailability(train.id) || train.availability
    }));
  }

  async getTrainById(id: string): Promise<Train | null> {
    await this.delay(200);
    const train = mockTrains.find(t => t.id === id);
    if (!train) return null;

    return {
      ...train,
      availability: orderService.getAvailability(train.id) || train.availability
    };
  }

  async getAllTrains(): Promise<Train[]> {
    await this.delay(300);
    return mockTrains.map(train => ({
      ...train,
      availability: orderService.getAvailability(train.id) || train.availability
    }));
  }

  addToWatchlist(trainId: string): void {
    this.watchlist.add(trainId);
    this.saveWatchlist();
  }

  removeFromWatchlist(trainId: string): void {
    this.watchlist.delete(trainId);
    this.saveWatchlist();
  }

  isInWatchlist(trainId: string): boolean {
    return this.watchlist.has(trainId);
  }

  async getWatchlist(): Promise<Train[]> {
    await this.delay(200);
    const trains = await this.getAllTrains();
    return trains.filter(t => this.watchlist.has(t.id));
  }

  private saveWatchlist(): void {
    try {
      localStorage.setItem('train_watchlist', JSON.stringify([...this.watchlist]));
    } catch (error) {
      console.error('Failed to save watchlist:', error);
    }
  }

  private loadWatchlist(): void {
    try {
      const stored = localStorage.getItem('train_watchlist');
      if (stored) {
        this.watchlist = new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const trainService = new TrainService();
