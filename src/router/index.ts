import { createRouter, createWebHistory } from 'vue-router'
import UserLoginVue from '@/views/UserLogin.vue'
import { checkAuth } from '@/auth/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserLoginVue
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log('checkAuth()', checkAuth())
    if (!checkAuth()) {
      console.log('aaaaa')
      next('/')
    } else {
      console.log('bbbb')
      next()
    }
  } else {
    next()
  }
})

export default router
