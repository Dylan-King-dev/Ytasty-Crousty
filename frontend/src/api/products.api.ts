import { api } from './client'

export interface ProductFilters {
  restaurant_id?: number
  category?: string
  q?: string
  is_available?: boolean
}

export function getProducts(filters: ProductFilters = {}) {
  return api.get('/products', { params: filters })
}

export function getProduct(id: number) {
  return api.get(`/products/${id}`)
}