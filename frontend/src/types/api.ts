export type Role = 'staff' | 'admin' | 'direction'
export type OrderStatus = 'pending' | 'validated' | 'preparing' | 'ready' | 'collected' | 'cancelled'
export type PickupMode = 'onsite' | 'takeaway'

export interface Restaurant {
  id: number
  name: string
  city: string
  address: string
  is_open: boolean
  opening_hours: string
  contact: string
}

export interface Product {
  id: number
  name: string
  image: string
  description: string
  category: string
  price: number
  is_available: boolean
  restaurant_id: number
  ingredients: string[]
}

export interface OrderItem {
  product_id: number
  quantity: number
}

export interface Customer {
  name: string
  email: string
}

export interface Order {
  order_number: string
  restaurant_id: number
  created_at: string
  items: OrderItem[]
  total_price: number
  status: OrderStatus
  pickup_mode: PickupMode
  customer: Customer
}

export interface CreateOrder {
  restaurant_id: number
  items: OrderItem[]
  pickup_mode: PickupMode
  customer: Customer
}

export interface ProductPayload {
  name: string
  image: string
  description: string
  category: string
  price: number
  is_available: boolean
  restaurant_id: number
  ingredients: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  role: Role
  restaurant_id: number | null
}

export interface UserCreate {
  first_name: string
  last_name: string
  username: string
  password: string
  role: Role
  restaurant_id: number | null
}