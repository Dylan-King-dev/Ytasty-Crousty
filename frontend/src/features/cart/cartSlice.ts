import { createSlice } from '@reduxjs/toolkit'
import type { CartLine } from './cartTypes'

interface CartState {
  items: CartLine[]
}

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
    },
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer