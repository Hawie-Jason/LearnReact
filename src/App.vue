<template>
  <div id="app">
    <header class="app-header">
      <nav class="nav-container">
        <h1 class="logo">🚂 Train Booking</h1>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/search" class="nav-link">Search</router-link>
          <router-link to="/watchlist" class="nav-link">Watchlist</router-link>
          <router-link to="/order-history" class="nav-link">Orders</router-link>
        </div>
      </nav>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>

    <SeatSelectionDialog />
  </div>
</template>

<script setup lang="ts">
import SeatSelectionDialog from '@/components/SeatSelectionDialog.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #3b82f6;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
