import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import authReducer from '../features/auth/authSlice'
import restaurantReducer from '../features/restaurant/restaurantSlice'

export const store = configureStore({
  reducer: { cart: cartReducer, auth: authReducer, restaurant: restaurantReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch