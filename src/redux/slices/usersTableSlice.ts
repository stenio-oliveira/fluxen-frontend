import type { GridColDef } from "@mui/x-data-grid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Usuario } from "../../types/Usuario";

export interface UserFilters{ 
    columnFilters: { 
        id: string | null;
        nome: string | null;
        email: string | null;
        username: string | null;
    };
    generalFilter: string;
}

interface UsersTableState {
  rows: Usuario[];
  columns: GridColDef[];
  loading: boolean;
  filters: UserFilters;
  creatingUser: boolean;
  editingUser: number | null;
  deletingUser: number | null;
}

const initialState: UsersTableState = {
  rows: [],
  columns: [],
  loading: false,
  filters: {
    columnFilters: {
      id: null,
      nome: null,
      email: null,
      username: null
    },
    generalFilter: "",
  },
  creatingUser: false,
  editingUser: null,
  deletingUser: null,
};

const usersTableSlice = createSlice({
  name: "usersTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<any[]>) {
      state.rows = action.payload;
    },
    setColumns(state, action: PayloadAction<any[]>) {
      state.columns = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFilters(state, action: PayloadAction<UserFilters>) {
      state.filters = action.payload;
    },
    setCreatingUser(state, action: PayloadAction<boolean>) {
      state.creatingUser = action.payload;
    },
    setEditingUser(state, action: PayloadAction<number | null>) {
      state.editingUser = action.payload;
    },
    setDeletingUser(state, action: PayloadAction<number | null>) {
      state.deletingUser = action.payload;
    },
    addUser(state, action: PayloadAction<Usuario>) {
      state.rows.push(action.payload);
    },
    replaceUser(state, action: PayloadAction<Usuario>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    removeUser(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
  },
});

export const {
  setRows,
  setColumns,
  setLoading,
  setFilters,
  setCreatingUser,
  setEditingUser,
  setDeletingUser,
  addUser,
  replaceUser,
  removeUser,
} = usersTableSlice.actions;

export default usersTableSlice.reducer;
