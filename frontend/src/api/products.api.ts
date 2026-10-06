import { api } from './client'
import type { ProductPayload, Product } from '../types/api'

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

export function createProduct(product: ProductPayload) {
  return api.post<Product>('/products', product)
}

export function updateProduct(id: number, product: ProductPayload) {
  return api.patch<Product>(`/products/${id}`, product)
}

export function updateProductAvailability(id: number, isAvailable: boolean) {
  return api.patch<Product>(`/products/${id}/availability`, {
    is_available: isAvailable,
  })
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}`)
}