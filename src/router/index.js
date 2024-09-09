import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Manage from '@/views/Manage.vue';
import Song from '@/views/Song.vue';
import useUserStore from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: 'text-yellow-500',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/manage',
      name: 'manage',
      meta: { requiresAuth: true },
      component: Manage
    },
    {
      path: '/song/:id',
      name: 'song',
      component: Song
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/About.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ]
});

router.beforeEach((to, from, next) => {
  // If the page doesn't require auth, do nothing
  if (!to.meta.requiresAuth) {
    return next();
  }

  // If the page requires auth but the user isn't logged in, redirect to home
  const store = useUserStore();
  if (store.isLoggedIn) {
    return next();
  }
  next({ name: 'home' });
});

export default router;
