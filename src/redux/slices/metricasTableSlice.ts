import type { GridColDef } from "@mui/x-data-grid";
import type { Metrica } from "../../types/Metrica";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface MetricasFilters {
  columnFilters: {
    id: string | null;
    nome: string | null;
    unidade: string | null;
  };
  generalFilter: string;
}

export interface MetricasTableState {
  rows: Metrica[];
  columns: GridColDef[];
  loading: boolean;
  filters: MetricasFilters;
  creatingMetrica : boolean;
  editingMetrica : number | null;
  deletingMetrica: number | null; // Updated to number or null
}

const initialState: MetricasTableState = {
  rows: [],
  columns: [],
  loading: false,
  filters: {
    columnFilters: {
      id: null,
      nome: null,
      unidade: null,
    },
    generalFilter: "",
  },
  creatingMetrica: false,
  editingMetrica: null,
  deletingMetrica: null, // Initialize as null
};

const metricasTableSlice = createSlice({
  name: "metricasTable",
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

    addMetrica(state, action: PayloadAction<Metrica>) {
      state.rows.push(action.payload);
    },
    setEditingMetrica(state, action: PayloadAction<number | null>) {
      state.editingMetrica = action.payload;
    },
    replaceMetrica(state, action: PayloadAction<Metrica>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },

    removeMetrica(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
    setFilters(state, action: PayloadAction<MetricasFilters>) {
      state.filters = action.payload;
    },
    setCreatingMetrica(state, action: PayloadAction<boolean>) {
      state.creatingMetrica = action.payload;
    },
    setDeletingMetrica(state, action: PayloadAction<number | null>) { // Updated reducer for deletingMetrica
      state.deletingMetrica = action.payload;
    },
  },
});

export const { setRows, setColumns, setLoading, setFilters, setCreatingMetrica, addMetrica, replaceMetrica, removeMetrica, setEditingMetrica, setDeletingMetrica} =
  metricasTableSlice.actions;

export default metricasTableSlice.reducer;
