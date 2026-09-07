import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/app/mapa' },
  { path: '/reset-password', component: () => import('@/views/ResetPasswordView.vue') },
  {
    path: '/app',
    component: () => import('@/views/app/AppLayout.vue'),
    children: [
      { path: '', redirect: '/app/mapa' },
      { path: 'mapa', component: () => import('@/views/app/MapaView.vue') },
      { path: 'registrar', component: () => import('@/views/onboarding/OnboardingLayout.vue') },
      { path: 'minhas', component: () => import('@/views/app/MinhasView.vue'), meta: { requiresAuth: true } },
      { path: 'alertas', component: () => import('@/views/app/AlertasView.vue'), meta: { requiresAuth: true } },
      { path: 'ranking', component: () => import('@/views/app/RankingView.vue') },
      { path: 'perfil', component: () => import('@/views/app/PerfilView.vue'), meta: { requiresAuth: true } },
      { path: 'sobre', component: () => import('@/views/app/SobreView.vue') },
      { path: 'feedback', component: () => import('@/views/app/FeedbackView.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/app/registrar'
  }
})

export default router
