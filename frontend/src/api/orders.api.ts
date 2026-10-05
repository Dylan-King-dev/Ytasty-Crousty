import { api } from './client'
import type { CreateOrder, Order } from '../types/api'

export function createOrder(order: CreateOrder) {
  return api.post<Order>('/orders', order)
}

export function getOrder(orderNumber: string) {
  return api.get<Order>(`/orders/${orderNumber}`)
}

export function getRestaurantOrders(restaurantId: number) {
  return api.get<Order[]>(`/restaurants/${restaurantId}/orders`)
}