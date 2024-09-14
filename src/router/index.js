import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutContainer',
      component: () => import('@/views/LayoutContainer/LayoutContainer.vue'),
      children: []
    }
  ],
  // 滚动行为
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
