import { api } from './client'

export function getRestaurants() {
  return api.get('/restaurants')
}

export function getRestaurant(id: number) {
  return api.get(`/restaurants/${id}`)
}

export function updateRestaurantAvailability(id: number, isOpen: boolean) {
  return api.patch(`/restaurants/${id}/availability`, { is_open: isOpen })
}