import {defineStore} from 'pinia'
import api from '@/utils/api.js'   // 👉 ఇక్కడ మీరు axios.create చేసిన instance ని import చేస్తున్నారు

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        masterData: JSON.parse(localStorage.getItem('masterData')) || null,
        loading: false,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login(email, password) {
            this.loading = true
            this.error = null
            try {

                debugger
                // custom axios instance వాడుతున్నాం
                const res = await api.post('/pre/login', {email, password})
                const {access_token, student, user} = res.data

                this.token = access_token
                this.student = student
                this.user = user

                localStorage.setItem('token', access_token)
                localStorage.setItem('student', student)
                localStorage.setItem('user', JSON.stringify(user))

                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed'
                return false
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.user = null
            this.student = null
            this.masterData = null
            localStorage.clear()
        }
    }
})
