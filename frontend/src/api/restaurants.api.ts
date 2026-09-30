import { api } from './client'

export function getRestaurants() {
  return api.get('/restaurants')
}

export function getRestaurant(id: number) {
  return api.get(`/restaurants/${id}`)
}