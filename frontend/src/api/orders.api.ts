import { api } from './client'
import type { CreateOrder, Order, OrderStatus } from '../types/api'

export function createOrder(order: CreateOrder) {
  return api.post<Order>('/orders', order)
}

export function getOrder(orderNumber: string) {
  return api.get<Order>(`/orders/${orderNumber}`)
}

export function getRestaurantOrders(restaurantId: number, token: string) {
  return api.get<Order[]>(`/restaurants/${restaurantId}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updateOrderStatus(orderNumber: string, status: OrderStatus, token: string) {
  return api.patch<Order>(
      `/orders/${orderNumber}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
  )
}

export function cancelOrder(orderNumber: string, token: string) {
  return api.post<Order>(
      `/orders/${orderNumber}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
  )
}