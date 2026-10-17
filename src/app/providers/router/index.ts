import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about/AboutPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users/UsersPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id',
    name: 'user-details',
    component: () => import('@/pages/user-details/UserDetailsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export function initRouter() {
  setupGuards(router)
  return router
}