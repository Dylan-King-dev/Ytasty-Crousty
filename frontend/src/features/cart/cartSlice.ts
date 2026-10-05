import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartLine } from './cartTypes'
import type { Product } from '../../types/api'

interface CartState {
  items: CartLine[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload

      if (!product.is_available) {
        return
      }

      const cartRestaurantId = state.items[0]?.product.restaurant_id
      if (cartRestaurantId && cartRestaurantId !== product.restaurant_id) {
        return
      }

      const line = state.items.find(
        (item) => item.product.id === product.id
      )

      if (line) {
        line.quantity += 1
      } else {
        state.items.push({ product, quantity: 1 })
      }
    },

    increaseQuantity(state, action: PayloadAction<number>) {
      const line = state.items.find(
        (item) => item.product.id === action.payload
      )

      if (line) {
        line.quantity += 1
      }
    },

    decreaseQuantity(state, action: PayloadAction<number>) {
      const line = state.items.find(
        (item) => item.product.id === action.payload
      )

      if (!line) {
        return
      }

      if (line.quantity <= 1) {
        state.items = state.items.filter(
          (item) => item.product.id !== action.payload
        )
      } else {
        line.quantity -= 1
      }
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      )
    },

    clearCart(state) {
      state.items = []
    },
  },
})

export const {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer