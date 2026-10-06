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

export function updateRestaurant(id: number, address: string, contact: string) {
  return api.patch(`/restaurants/${id}`, { address, contact })
}