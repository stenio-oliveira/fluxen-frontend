import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Usuario } from '../../types/Usuario';

type UserState = {
    user: Usuario | null;
  isLoggedIn: boolean;
};

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: Usuario}>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
     
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
