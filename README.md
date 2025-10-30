# Train Booking Simulation

A comprehensive train booking application built with Vue 3, TypeScript, and Pinia, featuring a complete end-to-end booking flow with mock payment simulation.

## Features

### Core Functionality
- **Train Search & Discovery**: Browse available trains with detailed information
- **Watchlist**: Save favorite trains for quick access
- **Booking Flow**: Complete booking workflow from search to confirmation
- **Seat Selection**: Interactive seat class selection with availability checks
- **Mock Payment**: Simulated payment processing with success/failure outcomes
- **Order History**: View and manage all past bookings with pagination
- **Order Management**: Cancel bookings and track order status

### Technical Features
- **Pinia State Management**: Centralized state management for bookings, orders, and trains
- **LocalStorage Persistence**: Order history and seat availability persisted across sessions
- **Availability Management**: Real-time seat availability tracking with automatic updates
- **Concurrency Handling**: Graceful handling of booking conflicts
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Type Safety**: Full TypeScript support throughout the application

## Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── TrainCard.vue
│   ├── SeatSelectionDialog.vue
│   └── OrderDetailsModal.vue
├── views/               # Page components
│   ├── HomePage.vue
│   ├── SearchPage.vue
│   ├── WatchlistPage.vue
│   ├── OrderConfirmationPage.vue
│   ├── PaymentPage.vue
│   ├── OrderSuccessPage.vue
│   ├── OrderFailurePage.vue
│   └── OrderHistoryPage.vue
├── stores/              # Pinia stores
│   ├── bookingStore.ts
│   ├── orderHistoryStore.ts
│   └── trainStore.ts
├── services/            # Mock API services
│   ├── orderService.ts
│   └── trainService.ts
├── router/              # Vue Router configuration
│   └── index.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## Booking Flow

1. **Search/Browse Trains**: Users can search for trains or view all available options
2. **Add to Watchlist** (Optional): Save trains for later viewing
3. **Book Now/Quick Book**: Start the booking process
4. **Seat Selection**: Choose seat class and enter passenger details with availability validation
5. **Order Confirmation**: Review booking details with editable sections
6. **Payment**: Simulate payment with success or failure outcome
7. **Result Screen**: View booking confirmation or failure message
8. **Order History**: Access all past bookings

## Mock Data & Services

### Train Service
- 5 mock trains with different routes and pricing
- Seat availability tracking (Economy, Business, First class)
- Watchlist management

### Order Service
- Order creation and management
- Payment simulation with configurable success/failure
- Seat availability decrementation on successful booking
- Concurrency conflict detection
- Order history with pagination
- Order cancellation with seat restoration

## State Management

### Booking Store
- Selected train and seat selection
- Current order tracking
- Payment processing state
- Error handling

### Order History Store
- Paginated order list
- Order filtering and sorting
- Order cancellation

### Train Store
- Train search results
- Watchlist management
- Availability updates

## Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Usage Examples

### Starting a Booking
1. Navigate to Search page
2. Click "Book Now" for detailed seat selection
3. Or click "Quick Book" for fast booking with default options

### Editing Booking Details
- On the Order Confirmation page, click "Edit" buttons to modify:
  - Train selection
  - Seat class
  - Passenger details

### Payment Simulation
- Choose "Simulate Success" for successful payment (80% probability in random mode)
- Choose "Simulate Failure" to test error handling
- Payment result determines order outcome

### Order History
- View all past bookings with status and payment information
- Paginated list (10 orders per page)
- Cancel confirmed bookings
- View detailed order information in modal

## LocalStorage Persistence

The application persists the following data:
- `booking_orders`: Complete order history
- `train_availability`: Current seat availability for all trains
- `train_watchlist`: User's saved trains

## Seat Availability Management

- Availability is checked before order creation
- Seats are decremented only on successful payment
- Cancelled bookings restore seat availability
- Concurrent booking conflicts are detected and prevented

## Payment Simulation

The mock payment system simulates:
- Processing delay (2 seconds)
- Random success/failure (configurable)
- Transaction ID generation
- Loading states and progress indication

## Acceptance Criteria ✅

- [x] Full booking simulation works end-to-end
- [x] Order confirmation with editable sections
- [x] Payment result handling (success/failure)
- [x] Order success and failure screens
- [x] Order history accessible and paginated
- [x] All powered by mock data
- [x] State persisted to localStorage
- [x] Seat availability decrements on booking
- [x] Availability updates reflected in UI
- [x] Concurrency/conflict errors handled gracefully

## Browser Support

- Modern browsers with ES2020+ support
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+
