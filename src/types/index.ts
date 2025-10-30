export type SeatClass = 'economy' | 'business' | 'first';

export type OrderStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Train {
  id: string;
  number: string;
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    economy: number;
    business: number;
    first: number;
  };
  availability: {
    economy: number;
    business: number;
    first: number;
  };
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber?: string;
}

export interface SeatSelection {
  seatClass: SeatClass;
  passengers: Passenger[];
  totalPrice: number;
}

export interface Order {
  id: string;
  train: Train;
  seatSelection: SeatSelection;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  pnr?: string;
}

export interface OrderHistoryItem extends Order {
  passengerCount: number;
}

export interface BookingState {
  selectedTrain: Train | null;
  seatSelection: SeatSelection | null;
  currentOrder: Order | null;
  isBooking: boolean;
  error: string | null;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface AvailabilityConflict {
  trainId: string;
  seatClass: SeatClass;
  requested: number;
  available: number;
}
