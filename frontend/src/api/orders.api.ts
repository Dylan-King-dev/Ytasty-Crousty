import { api } from './client'

export function getOrder(orderNumber: string) {
	return api.get(`/orders/${orderNumber}`)
}

export function getRestaurantOrders(restaurantId: number) {
	return api.get(`/restaurants/${restaurantId}/orders`)
}
