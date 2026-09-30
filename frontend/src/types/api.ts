export type Role = 'staff' | 'admin' | 'direction'
export type OrderStatus = 'pending' | 'validated' | 'preparing' | 'ready' | 'collected' | 'cancelled'
export type PickupMode = 'onsite' | 'takeaway'

export interface Restaurant {
  id: number
  name: string
  city: string
}

export interface Product {
  id: number
  name: string
}