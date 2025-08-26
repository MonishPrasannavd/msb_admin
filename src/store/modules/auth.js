import axios from 'axios'

// Simulated API endpoints for demonstration
const API_URL = 'https://api.example.com'

const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  authLoading: state => state.loading,
  authError: state => state.error
}

const actions = {
  async login({ commit }, credentials) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // For demo, we're simulating a successful login with a timeout
      // const response = await axios.post(`${API_URL}/auth/login`, credentials)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // For demo purposes, accept any valid email format and password with at least 6 characters
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const isValidEmail = emailRegex.test(credentials.email)
          const isValidPassword = credentials.password && credentials.password.length >= 6
          
          if (isValidEmail && isValidPassword) {
            const mockResponse = {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 1,
                email: credentials.email,
                name: credentials.email.split('@')[0] // Use email prefix as name
              }
            }
            
            localStorage.setItem('token', mockResponse.token)
            localStorage.setItem('user', JSON.stringify(mockResponse.user))
            
            commit('setAuth', mockResponse)
            commit('setLoading', false)
            resolve(mockResponse)
          } else {
            if (!isValidEmail) {
              throw new Error('Please enter a valid email address')
            } else if (!isValidPassword) {
              throw new Error('Password must be at least 6 characters long')
            } else {
              throw new Error('Invalid email or password')
            }
          }
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Authentication failed')
      commit('setLoading', false)
      throw error
    }
  },
  
  async forgotPassword({ commit }, { email }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // For demo, we're simulating a successful request with a timeout
      // const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setLoading', false)
          resolve({ message: 'Password reset instructions have been sent to your email' })
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to send reset instructions')
      commit('setLoading', false)
      throw error
    }
  },
  
  async resetPassword({ commit }, { token, password }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // For demo, we're simulating a successful request with a timeout
      // const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password })
      
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setLoading', false)
          resolve({ message: 'Password has been reset successfully' })
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to reset password')
      commit('setLoading', false)
      throw error
    }
  },
  
  logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('clearAuth')
  }
}

const mutations = {
  setAuth(state, { token, user }) {
    state.token = token
    state.user = user
  },
  clearAuth(state) {
    state.token = null
    state.user = null
  },
  setLoading(state, status) {
    state.loading = status
  },
  setError(state, error) {
    state.error = error
  },
  clearError(state) {
    state.error = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 