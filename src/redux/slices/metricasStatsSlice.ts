import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import MetricaService from '../../services/metricaService';

interface MetricasStats {
  totalMetricas: number;
  metricasAtivas: number;
  unidadesUnicas: number;
}

interface MetricasStatsState {
  stats: MetricasStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: MetricasStatsState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchMetricasStats = createAsyncThunk(
  'metricasStats/fetchMetricasStats',
  async () => {
    const stats = await MetricaService.getMetricasStats();
    return stats;
  }
);

const metricasStatsSlice = createSlice({
  name: 'metricasStats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetricasStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetricasStats.fulfilled, (state, action: PayloadAction<MetricasStats>) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchMetricasStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar estatísticas das métricas';
      });
  },
});

export const { clearError } = metricasStatsSlice.actions;
export default metricasStatsSlice.reducer;
