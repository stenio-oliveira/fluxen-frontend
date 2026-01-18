import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { stats, loading } = useSelector((state: RootState) => state.metricasStats);

  useEffect(() => {
    dispatch(fetchMetricasStats() as any);
  }, [dispatch]);


  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        bgcolor: "grey.50", 
        p: isMobile ? 2 : 3,
        pt: isMobile ? 6 : 3,
        marginLeft: sideMenuWidth,
        width: `calc(100vw - ${sideMenuWidth})`,
        maxWidth: "100%",
        boxSizing: "border-box",
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ 
          mb: isMobile ? 2 : 3,
          mt: isMobile ? 2 : 0,
          fontWeight: 600, 
          color: 'text.primary' 
        }}
      >
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

      <Box sx={{ flex: 1, minHeight: 0, mt: isMobile ? 2 : 3 }}>
        <MetricasTable />
      </Box>
    </Box>
  );
};

export default MetricasPage;
