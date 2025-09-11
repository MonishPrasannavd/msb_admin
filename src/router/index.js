import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthPreLayout from '../layouts/AuthPreLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        component: AuthPreLayout,
        redirect: '/login',
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
        path: '/',
        component: AuthLayout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'categories',
                name: 'Categories',
                component: () => import('../views/Categories/CategoriesPage.vue'),
                meta: { requiresAuth: true }
            },





            {
                path: 'quizzes',
                name: 'Quizzes',
                component: () => import('../views/quiz/QuizzesListPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'quizzes/add',
                name: 'AddQuiz',
                component: () => import('../views/quiz/AddQuizPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'quizzes/:id/edit',
                name: 'EditQuiz',
                component: () => import('../views/quiz/EditQuizPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'talents/:id',
                name: 'TalentView',
                component: () => import('../views/talent/TalentViewPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'talents/:talentId/sub-talents/:subTalentId',
                name: 'SubTalentView',
                component: () => import('../views/talent/SubTalentViewPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'privacy-policy',
                name: 'PrivacyPolicy',
                component: () => import('../views/legal/PrivacyPolicyPage.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'terms-and-conditions',
                name: 'TermsAndConditions',
                component: () => import('../views/legal/TermsAndConditionsPage.vue'),
                meta: { requiresAuth: true }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 🔑 Route Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    // Route requires login but user not authenticated
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login')
    }
    // Already logged in but trying to access auth pages
    else if (
        isAuthenticated &&
        ['Login', 'ForgotPassword', 'ResetPassword'].includes(to.name)
    ) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
