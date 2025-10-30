<template>
  <div class="home-page">
    <div class="hero">
      <h1>Welcome to Train Booking</h1>
      <p>Book your train tickets with ease</p>
    </div>

    <div class="quick-actions">
      <router-link to="/search" class="action-card">
        <div class="icon">🔍</div>
        <h3>Search Trains</h3>
        <p>Find and book your perfect train</p>
      </router-link>

      <router-link to="/watchlist" class="action-card">
        <div class="icon">⭐</div>
        <h3>My Watchlist</h3>
        <p>View your saved trains</p>
      </router-link>

      <router-link to="/order-history" class="action-card">
        <div class="icon">📋</div>
        <h3>Order History</h3>
        <p>Track your bookings</p>
      </router-link>
    </div>

    <div class="features">
      <h2>Why Choose Us?</h2>
      <div class="feature-grid">
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <h3>Quick Booking</h3>
          <p>Book tickets in just a few clicks with our streamlined process</p>
        </div>
        <div class="feature">
          <div class="feature-icon">💳</div>
          <h3>Secure Payments</h3>
          <p>Safe and secure payment processing for peace of mind</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🎫</div>
          <h3>Instant Confirmation</h3>
          <p>Get your booking confirmation instantly via email and SMS</p>
        </div>
        <div class="feature">
          <div class="feature-icon">📱</div>
          <h3>Easy Management</h3>
          <p>Manage all your bookings from one convenient dashboard</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.5rem;
  opacity: 0.9;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.action-card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.action-card p {
  color: #6b7280;
  font-size: 0.875rem;
}

.features {
  margin-top: 4rem;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1f2937;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.feature p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
