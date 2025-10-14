import { createSlice } from '@reduxjs/toolkit';

export interface SideMenuState {
  sideMenuOpen: boolean;
  sideMenuWidth: string;
}

const initialState: SideMenuState = {
  sideMenuOpen: false,
  sideMenuWidth: '0',
};

export const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    toggleSideMenu: (state) => {
      state.sideMenuOpen = !state.sideMenuOpen;
      state.sideMenuWidth = state.sideMenuOpen ? '250px' : '0';
    },
  },
});

export const { toggleSideMenu } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
