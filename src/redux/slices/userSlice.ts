import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Usuario } from '../../types/Usuario';

type UserState = {
    user: Usuario | null;
  isLoggedIn: boolean;
  isAuthChecking: boolean;
};

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isAuthChecking: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: Usuario}>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isAuthChecking = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAuthChecking = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecking = action.payload;
    },
  },
});

export const { login, logout, setAuthChecking } = userSlice.actions;
export default userSlice.reducer;
