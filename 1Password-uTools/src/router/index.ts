import type { RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../stores/app'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/index.vue'),
    },
    {
      path: '/item-list',
      name: 'item-list',
      component: () => import('../views/PasswordItems/index.vue'),
    },
    {
      path: '/vault-list',
      name: 'vault-list',
      component: () => import('../views/Vaults/index.vue'),
    },
    {
      path: '/generate-password',
      name: 'generate-password',
      component: () => import('../views/GeneratePassword/index.vue'),
    },
  ],
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const appStore = useAppStore()

  // If the route matches a feature code, use that route
  if (appStore.route && to.path === '/') {
    return { path: `/${appStore.route}` }
  }
})

export default router
