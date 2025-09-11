// src/utils/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Request interceptor → ప్రతి request లో token పంపుతుంది
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor → token expire అయితే redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem('token')

            // Vue Router ఉంటే ఇలా redirect చేయొచ్చు
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default api
