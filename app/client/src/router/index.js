import { createRouter, createWebHistory, RouterView } from 'vue-router'
import DefaultView from '../views/DefaultView.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/default-view',
      name: 'default-view',
      component: DefaultView,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/pages/HomePage.vue'),
        },
        {
          path: '/blogs/:slug',
          name: 'blog',
          component: () => import('@/pages/BlogPage.vue'),
        },
        {
          path: '/profile/:userId',
          name: 'profile',
          component: () => import('@/pages/ProfilePage.vue'),
        },
        {
          path: '/auth-guard',
          name: 'auth-guard',
          beforeEnter: (to, from, next) => {
            const authStore = useAuthStore()
            const toast = useToast()

            if (!authStore.token || !authStore.user) {
              toast.error('Please sign in first')
              next({ name: 'home' })
            } else {
              next()
            }
          },
          children: [
            {
              path: '/create-blog',
              name: 'create-blog',
              component: () => import('@/pages/CreateBlogPage.vue'),
            },
            {
              path: '/edit-blog/:slug',
              name: 'edit-blog',
              component: () => import('@/pages/EditBlogPage.vue'),
            },
            {
              path: '/edit-profile',
              name: 'edit-profile',
              component: () => import('@/pages/EditProfilePage.vue'),
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach(async () => {
  const authStore = useAuthStore()

  if (!authStore.token) {
    authStore.setGuestMode()
    return
  }

  if (!authStore.user) {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      const user = await response.json()
      authStore.setUser(user)
    } else {
      authStore.setGuestMode()
    }
  }
})

export default router
