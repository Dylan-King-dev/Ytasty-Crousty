import { api } from './client'
import type { TokenResponse } from '../types/api'

export function login(username: string, password: string) {
  return api.post<TokenResponse>('/auth/login', { username, password })
}