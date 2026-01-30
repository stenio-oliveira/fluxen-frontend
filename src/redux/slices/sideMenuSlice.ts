import { createSlice } from '@reduxjs/toolkit';

export interface SideMenuState {
  sideMenuOpen: boolean;
  sideMenuWidth: string;
}

const initialState: SideMenuState = {
  sideMenuOpen: true, // Sidebar sempre aberta por padrão
  sideMenuWidth: '220px', // Largura quando expandida
};

export const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    toggleSideMenu: (state) => {
      state.sideMenuOpen = !state.sideMenuOpen;
      state.sideMenuWidth = state.sideMenuOpen ? '220px' : '64px';
    },
  },
});

export const { toggleSideMenu } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
