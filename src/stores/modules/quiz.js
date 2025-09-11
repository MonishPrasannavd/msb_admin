import axios from 'axios'

// Simulated API endpoints for demonstration
const API_URL = 'https://api.example.com'

// Mock data for demonstration purposes
const MOCK_CATEGORIES = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'Literature' },
  { id: 4, name: 'History' }
]

const MOCK_QUIZZES = [
  { 
    id: 1, 
    title: 'Basic Algebra', 
    category_id: 1, 
    grade: '9th Grade', 
    published_date: '2025-03-01', 
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the value of x in the equation 2x + 5 = 15?',
        options: ['4', '5', '6', '7'],
        correct_answer: '5'
      },
      {
        id: 2,
        text: 'Simplify the expression: 3(x + 2) - 4x',
        options: ['3x + 6', '3x - 4x + 6', 'x + 6', '-x + 6'],
        correct_answer: '-x + 6'
      }
    ]
  },
  { 
    id: 2, 
    title: 'Physics Basics', 
    category_id: 2, 
    grade: '10th Grade', 
    published_date: '2025-02-15', 
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the unit of force in the SI system?',
        options: ['Watt', 'Joule', 'Newton', 'Pascal'],
        correct_answer: 'Newton'
      },
      {
        id: 2,
        text: 'What is the formula for calculating work?',
        options: ['W = m × g', 'W = F × d', 'W = m × v²/2', 'W = P × t'],
        correct_answer: 'W = F × d'
      }
    ]
  }
]

const state = {
  quizzes: [],
  currentQuiz: null,
  categories: [],
  loading: false,
  error: null
}

const getters = {
  allQuizzes: state => state.quizzes,
  currentQuiz: state => state.currentQuiz,
  allCategories: state => state.categories,
  quizLoading: state => state.loading,
  quizError: state => state.error
}

const actions = {
  // Get all quizzes
  async fetchQuizzes({ commit }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/quizzes`)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setQuizzes', MOCK_QUIZZES)
          commit('setLoading', false)
          resolve(MOCK_QUIZZES)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to fetch quizzes')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Get a single quiz by ID
  async fetchQuiz({ commit }, id) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/quizzes/${id}`)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const quiz = MOCK_QUIZZES.find(q => q.id === parseInt(id))
          if (!quiz) {
            throw new Error('Quiz not found')
          }
          
          commit('setCurrentQuiz', quiz)
          commit('setLoading', false)
          resolve(quiz)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to fetch quiz')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Create a new quiz
  async createQuiz({ commit }, quizData) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(`${API_URL}/quizzes`, quizData)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newQuiz = {
            id: MOCK_QUIZZES.length + 1,
            ...quizData,
            published_date: new Date().toISOString().split('T')[0],
            status: 'active'
          }
          
          commit('addQuiz', newQuiz)
          commit('setLoading', false)
          resolve(newQuiz)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to create quiz')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Update an existing quiz
  async updateQuiz({ commit }, { id, data }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`${API_URL}/quizzes/${id}`, data)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedQuiz = { ...data, id: parseInt(id) }
          commit('updateQuiz', updatedQuiz)
          commit('setLoading', false)
          resolve(updatedQuiz)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to update quiz')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Toggle quiz status (enable/disable)
  async toggleQuizStatus({ commit }, { id, status }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.patch(`${API_URL}/quizzes/${id}/status`, { status })
      
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('updateQuizStatus', { id, status })
          commit('setLoading', false)
          resolve({ id, status })
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to update quiz status')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Get all categories
  async fetchCategories({ commit }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/categories`)
      
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setCategories', MOCK_CATEGORIES)
          commit('setLoading', false)
          resolve(MOCK_CATEGORIES)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to fetch categories')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Create a new category
  async createCategory({ commit }, { name }) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(`${API_URL}/categories`, { name })
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newCategory = {
            id: MOCK_CATEGORIES.length + 1,
            name
          }
          
          commit('addCategory', newCategory)
          commit('setLoading', false)
          resolve(newCategory)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to create category')
      commit('setLoading', false)
      throw error
    }
  },
  
  // Process CSV upload
  async processQuizCsv({ commit }, fileData) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      // In a real app, this would involve file upload and processing
      // For demo, we'll just simulate the response
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate parsed questions from CSV
          const questions = [
            {
              id: 1,
              text: 'Sample Question 1',
              options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
              correct_answer: 'Option 2'
            },
            {
              id: 2,
              text: 'Sample Question 2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: 'Option C'
            }
          ]
          
          commit('setLoading', false)
          resolve(questions)
        }, 1000)
      })
    } catch (error) {
      commit('setError', error.message || 'Failed to process CSV file')
      commit('setLoading', false)
      throw error
    }
  }
}

const mutations = {
  setQuizzes(state, quizzes) {
    state.quizzes = quizzes
  },
  setCurrentQuiz(state, quiz) {
    state.currentQuiz = quiz
  },
  addQuiz(state, quiz) {
    state.quizzes.push(quiz)
  },
  updateQuiz(state, updatedQuiz) {
    const index = state.quizzes.findIndex(q => q.id === updatedQuiz.id)
    if (index !== -1) {
      state.quizzes.splice(index, 1, updatedQuiz)
    }
    if (state.currentQuiz && state.currentQuiz.id === updatedQuiz.id) {
      state.currentQuiz = updatedQuiz
    }
  },
  updateQuizStatus(state, { id, status }) {
    const quiz = state.quizzes.find(q => q.id === parseInt(id))
    if (quiz) {
      quiz.status = status
    }
  },
  setCategories(state, categories) {
    state.categories = categories
  },
  addCategory(state, category) {
    state.categories.push(category)
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