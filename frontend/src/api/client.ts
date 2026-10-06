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