import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/LoginPage.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/auth/ForgotPasswordPage.vue')
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('../views/auth/ResetPasswordPage.vue')
      }
    ]
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: () => import('../views/quiz/QuizzesListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/add',
    name: 'AddQuiz',
    component: () => import('../views/quiz/AddQuizPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/:id/edit',
    name: 'EditQuiz',
    component: () => import('../views/quiz/EditQuizPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/legal/PrivacyPolicyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import('../views/legal/TermsAndConditionsPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 