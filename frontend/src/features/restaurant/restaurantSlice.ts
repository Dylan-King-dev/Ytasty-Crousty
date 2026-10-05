import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface RestaurantState {
  selectedId: number
}

const initialState: RestaurantState = {
  selectedId: 1,
}

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    selectRestaurant(state, action: PayloadAction<number>) {
      state.selectedId = action.payload
    },
  },
})

export const { selectRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer