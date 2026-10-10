import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Головна - Lottery App', layout: 'DefaultLayout' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'Про автора - Lottery App', layout: 'DefaultLayout' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Авторизація - Lottery App', layout: 'AuthLayout' },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/UsersView.vue'),
    meta: { requiresAuth: true, title: 'Користувачі - Lottery App', layout: 'DefaultLayout' },
    children: [
      {
        path: ':id/edit',
        name: 'UserEdit',
        component: () => import('../views/UserEditView.vue'),
        props: true,
        meta: { requiresAuth: true, title: 'Редагування користувача', layout: 'DefaultLayout' },
      },
    ],
  },
  {
    path: '/users/:id',
    name: 'UserDetails',
    component: () => import('../views/UserDetailsView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Профіль користувача', layout: 'DefaultLayout' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '404 - Сторінку не знайдено', layout: 'DefaultLayout' },
  },
];

const router = createRouter({
history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Users' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;