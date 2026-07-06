import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cephalometric',
      name: 'cephalometric',
      component: () => import('../views/CephaloView.vue'),
    },
    {
      path: '/panoramic',
      name: 'panoramic',
      component: () => import('../views/PanoramicView.vue'),
    },
    {
      path: '/autocrop',
      name: 'autocrop',
      component: () => import('../views/AutoCropView.vue'),
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: () => import('../views/DiagnosisView.vue'),
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('../views/CasesView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
