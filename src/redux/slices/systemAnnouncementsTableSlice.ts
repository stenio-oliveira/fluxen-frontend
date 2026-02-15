import type { SystemAnnouncement } from "../../types/SystemAnnouncement";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SystemAnnouncementFilters {
  columnFilters: {
    id: string | null;
    title: string | null;
    type: string | null;
    is_active: string | null;
  };
  generalFilter: string;
}

export interface SystemAnnouncementsTableState {
  rows: SystemAnnouncement[];
  loading: boolean;
  filters: SystemAnnouncementFilters;
  creatingAnnouncement: boolean;
  editingAnnouncement: number | null;
  deletingAnnouncement: number | null;
}

const initialState: SystemAnnouncementsTableState = {
  rows: [],
  loading: false,
  filters: {
    columnFilters: {
      id: null,
      title: null,
      type: null,
      is_active: null,
    },
    generalFilter: "",
  },
  creatingAnnouncement: false,
  editingAnnouncement: null,
  deletingAnnouncement: null,
};

const systemAnnouncementsTableSlice = createSlice({
  name: "systemAnnouncementsTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<SystemAnnouncement[]>) {
      state.rows = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFilters(state, action: PayloadAction<SystemAnnouncementFilters>) {
      state.filters = action.payload;
    },
    setCreatingAnnouncement(state, action: PayloadAction<boolean>) {
      state.creatingAnnouncement = action.payload;
    },
    setEditingAnnouncement(state, action: PayloadAction<number | null>) {
      state.editingAnnouncement = action.payload;
    },
    setDeletingAnnouncement(state, action: PayloadAction<number | null>) {
      state.deletingAnnouncement = action.payload;
    },
    addAnnouncement(state, action: PayloadAction<SystemAnnouncement>) {
      state.rows.push(action.payload);
    },
    replaceAnnouncement(state, action: PayloadAction<SystemAnnouncement>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    removeAnnouncement(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
  },
});

export const {
  setRows,
  setLoading,
  setFilters,
  setCreatingAnnouncement,
  setEditingAnnouncement,
  setDeletingAnnouncement,
  addAnnouncement,
  replaceAnnouncement,
  removeAnnouncement,
} = systemAnnouncementsTableSlice.actions;

export default systemAnnouncementsTableSlice.reducer;
