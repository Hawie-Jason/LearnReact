import type { Train, Order, SeatSelection, PaymentResult, AvailabilityConflict, SeatClass } from '@/types';

const STORAGE_KEY = 'booking_orders';
const AVAILABILITY_KEY = 'train_availability';

class OrderService {
  private orders: Order[] = [];
  private availability: Map<string, Train['availability']> = new Map();

  constructor() {
    this.loadOrders();
    this.initializeAvailability();
  }

  private loadOrders(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  }

  private saveOrders(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
    } catch (error) {
      console.error('Failed to save orders:', error);
    }
  }

  private initializeAvailability(): void {
    try {
      const stored = localStorage.getItem(AVAILABILITY_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.availability = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  }

  private saveAvailability(): void {
    try {
      const data = Object.fromEntries(this.availability);
      localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  }

  initializeTrainAvailability(train: Train): void {
    if (!this.availability.has(train.id)) {
      this.availability.set(train.id, { ...train.availability });
      this.saveAvailability();
    }
  }

  getAvailability(trainId: string): Train['availability'] | null {
    return this.availability.get(trainId) || null;
  }

  checkAvailability(trainId: string, seatClass: SeatClass, count: number): boolean {
    const availability = this.availability.get(trainId);
    if (!availability) return false;
    return availability[seatClass] >= count;
  }

  async checkAvailabilityConflict(
    trainId: string,
    seatClass: SeatClass,
    requestedSeats: number
  ): Promise<AvailabilityConflict | null> {
    await this.delay(300);
    
    const availability = this.availability.get(trainId);
    if (!availability) {
      return {
        trainId,
        seatClass,
        requested: requestedSeats,
        available: 0
      };
    }

    if (availability[seatClass] < requestedSeats) {
      return {
        trainId,
        seatClass,
        requested: requestedSeats,
        available: availability[seatClass]
      };
    }

    return null;
  }

  private decrementAvailability(trainId: string, seatClass: SeatClass, count: number): void {
    const availability = this.availability.get(trainId);
    if (availability && availability[seatClass] >= count) {
      availability[seatClass] -= count;
      this.availability.set(trainId, availability);
      this.saveAvailability();
    }
  }

  private incrementAvailability(trainId: string, seatClass: SeatClass, count: number): void {
    const availability = this.availability.get(trainId);
    if (availability) {
      availability[seatClass] += count;
      this.availability.set(trainId, availability);
      this.saveAvailability();
    }
  }

  private generatePNR(): string {
    return `PNR${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  private generateOrderId(): string {
    return `ORD${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createOrder(train: Train, seatSelection: SeatSelection): Promise<Order> {
    await this.delay(500);

    const conflict = await this.checkAvailabilityConflict(
      train.id,
      seatSelection.seatClass,
      seatSelection.passengers.length
    );

    if (conflict) {
      throw new Error(
        `Insufficient seats. Requested: ${conflict.requested}, Available: ${conflict.available}`
      );
    }

    const order: Order = {
      id: this.generateOrderId(),
      train,
      seatSelection,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(order);
    this.saveOrders();

    return order;
  }

  async processPayment(orderId: string, simulateFailure?: boolean): Promise<PaymentResult> {
    await this.delay(2000);

    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const shouldFail = simulateFailure ?? Math.random() < 0.2;

    if (shouldFail) {
      order.status = 'failed';
      order.paymentStatus = 'failed';
      order.updatedAt = new Date().toISOString();
      this.saveOrders();

      return {
        success: false,
        message: 'Payment failed. Please try again or use a different payment method.'
      };
    }

    this.decrementAvailability(
      order.train.id,
      order.seatSelection.seatClass,
      order.seatSelection.passengers.length
    );

    order.status = 'confirmed';
    order.paymentStatus = 'success';
    order.pnr = this.generatePNR();
    order.updatedAt = new Date().toISOString();
    this.saveOrders();

    return {
      success: true,
      transactionId: `TXN${Date.now()}`,
      message: 'Payment successful! Your booking is confirmed.'
    };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    await this.delay(200);
    return this.orders.find(o => o.id === orderId) || null;
  }

  async getOrderHistory(page: number = 1, pageSize: number = 10): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    await this.delay(300);

    const sortedOrders = [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = sortedOrders.slice(start, end);

    return {
      orders: paginatedOrders,
      total: this.orders.length,
      page,
      pageSize,
      totalPages: Math.ceil(this.orders.length / pageSize)
    };
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.delay(500);

    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'confirmed' && order.paymentStatus === 'success') {
      this.incrementAvailability(
        order.train.id,
        order.seatSelection.seatClass,
        order.seatSelection.passengers.length
      );
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    this.saveOrders();
  }

  clearAllOrders(): void {
    this.orders = [];
    this.saveOrders();
  }

  clearAvailability(): void {
    this.availability.clear();
    this.saveAvailability();
  }
}

export const orderService = new OrderService();
