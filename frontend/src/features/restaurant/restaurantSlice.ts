import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: { selectedId: null as number | null },
  reducers: {
    selectRestaurant(state, action: PayloadAction<number>) {
      state.selectedId = action.payload
    },
  },
})

export const { selectRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer