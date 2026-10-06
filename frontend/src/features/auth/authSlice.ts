import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '../../types/api'

interface AuthState {
  token: string | null
  username: string | null
  fullName: string | null
  role: Role | null
}

const initialState: AuthState = {
  token: localStorage.getItem('ytasty_access_token'),
  username: localStorage.getItem('ytasty_username'),
  fullName: localStorage.getItem('ytasty_full_name'),
  role: localStorage.getItem('ytasty_role') as Role | null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; username: string; fullName: string; role: Role }>) {
      state.token = action.payload.token
      state.username = action.payload.username
      state.fullName = action.payload.fullName
      state.role = action.payload.role
    },
    logout(state) {
      state.token = null
      state.username = null
      state.fullName = null
      state.role = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer