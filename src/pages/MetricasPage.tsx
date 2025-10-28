import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MetricasTable from '../tables/MetricasTable';
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { Assessment, Speed, TrendingUp } from '@mui/icons-material';
import type { RootState } from '../redux/store';
import { fetchMetricasStats } from '../redux/slices/metricasStatsSlice';

const MetricasPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state: RootState) => state.metricasStats);

  useEffect(() => {
    dispatch(fetchMetricasStats() as any);
  }, [dispatch]);


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "grey.50", p: 3, width: "90vw" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Métricas
      </Typography>

      <StatsContainer title="Estatísticas">
        <StatsCard
          title="Total de Métricas"
          value={stats?.totalMetricas || 0}
          icon={<Assessment />}
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Métricas Ativas"
          value={stats?.metricasAtivas || 0}
          icon={<TrendingUp />}
          color="success"
          loading={loading}
        />
        <StatsCard
          title="Unidades Diferentes"
          value={stats?.unidadesUnicas || 0}
          icon={<Speed />}
          color="info"
          loading={loading}
        />
      </StatsContainer>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <MetricasTable />
      </Box>
    </Box>
  );
};

export default MetricasPage;
