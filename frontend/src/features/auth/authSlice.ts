import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '../../types/api'

interface AuthState {
  token: string | null
  username: string | null
  role: Role | null
}

const initialState: AuthState = {
  token: localStorage.getItem('ytasty_access_token'),
  username: localStorage.getItem('ytasty_username'),
  role: localStorage.getItem('ytasty_role') as Role | null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; username: string; role: Role }>) {
      state.token = action.payload.token
      state.username = action.payload.username
      state.role = action.payload.role
    },
    logout(state) {
      state.token = null
      state.username = null
      state.role = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer