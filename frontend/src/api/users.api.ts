import { api } from './client'
import type { UserCreate } from '../types/api'

export function createUser(user: UserCreate) {
  return api.post('/users', user)
}