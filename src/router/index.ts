import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchPage.vue')
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/WatchlistPage.vue')
    },
    {
      path: '/order-confirmation',
      name: 'order-confirmation',
      component: () => import('@/views/OrderConfirmationPage.vue')
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/PaymentPage.vue')
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('@/views/OrderSuccessPage.vue')
    },
    {
      path: '/order-failure',
      name: 'order-failure',
      component: () => import('@/views/OrderFailurePage.vue')
    },
    {
      path: '/order-history',
      name: 'order-history',
      component: () => import('@/views/OrderHistoryPage.vue')
    }
  ]
});

export default router;
