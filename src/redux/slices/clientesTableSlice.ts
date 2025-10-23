import type { Cliente } from "../../types/Cliente";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ClienteFilters {
  columnFilters: {
    id: string | null;
    nome: string | null;
    cnpj: string | null;
    responsavel_nome: string | null;
  };
  generalFilter: string;
}

export interface ClientesTableState {
  rows: Cliente[];
//   columns: GridColDef[];
  loading: boolean;
  filters: ClienteFilters;
  creatingCliente: boolean;
  editingCliente: number | null;
  deletingCliente: number | null;
}

const initialState: ClientesTableState = {
  rows: [],
//   columns: [],
  loading: false,
  filters: {
    columnFilters: {
      id: null,
      nome: null,
      cnpj: null,
      responsavel_nome: null,
    },
    generalFilter: "",
  },
  creatingCliente: false,
  editingCliente: null,
  deletingCliente: null,
};

const clientesTableSlice = createSlice({
  name: "clientesTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Cliente[]>) {
      state.rows = action.payload;
    },
    // setColumns(state, action: PayloadAction<GridColDef[]>) {
    //   state.columns = action.payload;
    // },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFilters(state, action: PayloadAction<ClienteFilters>) {
      state.filters = action.payload;
    },
    setCreatingCliente(state, action: PayloadAction<boolean>) {
      state.creatingCliente = action.payload;
    },
    setEditingCliente(state, action: PayloadAction<number | null>) {
      state.editingCliente = action.payload;
    },
    setDeletingCliente(state, action: PayloadAction<number | null>) {
      state.deletingCliente = action.payload;
    },
    addCliente(state, action: PayloadAction<Cliente>) {
      state.rows.push(action.payload);
    },
    replaceCliente(state, action: PayloadAction<Cliente>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    removeCliente(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
  },
});

export const {
  setRows,
  setLoading,
  setFilters,
  setCreatingCliente,
  setEditingCliente,
  setDeletingCliente,
  addCliente,
  replaceCliente,
  removeCliente,
} = clientesTableSlice.actions;

export default clientesTableSlice.reducer;
