import type { Product } from '../../types/api'

export interface CartLine {
  product: Product
  quantity: number
}