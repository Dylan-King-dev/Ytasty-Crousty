import axios from 'axios'

export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
    baseURL: apiBaseUrl,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ytasty_access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Après chaque réponse : si le token est expiré (401), on vide la session et on renvoie vers /login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem('ytasty_access_token')) {
            localStorage.removeItem('ytasty_access_token')
            localStorage.removeItem('ytasty_username')
            localStorage.removeItem('ytasty_full_name')
            localStorage.removeItem('ytasty_role')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)