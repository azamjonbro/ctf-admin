import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboard.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
