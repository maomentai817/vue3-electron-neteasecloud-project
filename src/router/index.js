import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutContainer',
      component: () => import('@/views/LayoutContainer/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'recommendPage',
          component: () => import('@/views/RecommendPage/RecommendPage.vue')
        },
        {
          path: '/recommend',
          name: 'winnowPage',
          component: () => import('@/views/WinnowPage/WinnowPage.vue')
        },
        {
          path: '/local',
          name: 'localList',
          component: () => import('@/views/LocalList/LocalList.vue')
        },
        {
          path: '/history',
          name: 'recentlyList',
          component: () => import('@/views/RecentlyList/RecentlyList.vue')
        },
        {
          path: '/cloud',
          name: 'musicCloud',
          component: () => import('@/views/MusicCloud/MusicCloud.vue')
        },
        {
          path: '/user',
          name: 'userCenter',
          component: () => import('@/views/UserCenter/UserCenter.vue')
        },
        {
          path: 'play-list',
          name: 'playList',
          component: () => import('@/views/PlayList/PlayList.vue')
        },
        {
          path: '/singer',
          name: 'singerCenter',
          component: () => import('@/views/SingerCenter/SingerCenter.vue')
        },
        {
          path: '/album',
          name: 'albumPage',
          component: () => import('@/views/AlbumPage/AlbumPage.vue')
        }
      ]
    }
  ],
  // 滚动行为
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
