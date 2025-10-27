import type { GridColDef } from "@mui/x-data-grid";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Equipamento } from "../../types/Equipamento";


export interface EquipmentFilters{ 
    columnFilters: { 
        id: string | null;
        nome: string | null;
        cliente_nome: string | null;
    };
    generalFilter: string;
}

interface EquipamentosTableState {
  rows: Equipamento[];
  columns: GridColDef[];
  loading: boolean;
  filters: EquipmentFilters;
  creatingEquipamento: boolean;
  editingEquipamento: number | null;
  deletingEquipamento: number | null;
}

const initialState: EquipamentosTableState = {
  rows: [],
  columns: [],
  loading: false,
  filters: {
    columnFilters: {
      id: null,
      nome: null,
      cliente_nome: null
    },
    generalFilter: "",
  },
  creatingEquipamento: false,
  editingEquipamento: null,
  deletingEquipamento: null,
};

const equipamentosTableSlice = createSlice({
  name: "equipamentosTable",
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
    setFilters(state, action: PayloadAction<EquipmentFilters>) {
      state.filters = action.payload;
    },
    setCreatingEquipamento(state, action: PayloadAction<boolean>) {
      state.creatingEquipamento = action.payload;
    },
    setEditingEquipamento(state, action: PayloadAction<number | null>) {
      state.editingEquipamento = action.payload;
    },
    setDeletingEquipamento(state, action: PayloadAction<number | null>) {
      state.deletingEquipamento = action.payload;
    },
    addEquipamento(state, action: PayloadAction<Equipamento>) {
      state.rows = [action.payload, ...state.rows];
    },
    replaceEquipamento(state, action: PayloadAction<Equipamento>) {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    removeEquipamento(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
  },
});

export const {
  setRows,
  setColumns,
  setLoading,
  setFilters,
  setCreatingEquipamento,
  setEditingEquipamento,
  setDeletingEquipamento,
  addEquipamento,
  replaceEquipamento,
  removeEquipamento,
} = equipamentosTableSlice.actions;

export default equipamentosTableSlice.reducer;
