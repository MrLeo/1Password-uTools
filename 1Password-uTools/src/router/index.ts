import { createRouter, createWebHistory } from 'vue-router'

import Hello from '../views/Hello/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Hello,
    },
    {
      path: '/read',
      name: 'read',
      component: () => import('../views/Read/index.vue'),
    },
    {
      path: '/write',
      name: 'write',
      component: () => import('../views/Write/index.vue'),
    },
  ],
})

export default router
