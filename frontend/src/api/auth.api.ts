import { api } from './client'

export function login(username: string, password: string) {
  return api.post('/auth/login', { username, password })
}