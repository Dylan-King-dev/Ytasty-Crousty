import { api } from './client'
import type { UserCreate, UserResponse } from '../types/api'

export function getUsers() {
  return api.get<UserResponse[]>('/users')
}

export function createUser(user: UserCreate) {
  return api.post<UserResponse>('/users', user)
}

export function deleteUser(userId: number) {
  return api.delete(`/users/${userId}`)
}