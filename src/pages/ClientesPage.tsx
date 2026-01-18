import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ClientesTable from '../tables/ClientesTable';
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { Business, Assignment } from '@mui/icons-material';
import type { RootState } from '../redux/store';

const ClientesPage: React.FC = () => {
  const { rows } = useSelector((state: RootState) => state.clientesTable);
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalClientes = rows.length;
  const clientesComCnpj = rows.filter(cliente => cliente.cnpj).length;
  // const clientesComEquipamentos = rows.filter(cliente => cliente.equipamento && cliente.equipamento.length > 0).length;

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
        Clientes
      </Typography>

      <StatsContainer title="Estatísticas">
        <StatsCard
          title="Total de Clientes"
          value={totalClientes}
          icon={<Business />}
          color="primary"
        />
        <StatsCard
          title="Com CNPJ"
          value={clientesComCnpj}
          icon={<Assignment />}
          color="success"
        />

      </StatsContainer>

      <Box sx={{ flex: 1, minHeight: 0, mt: isMobile ? 2 : 3 }}>
        <ClientesTable />
      </Box>
    </Box>
  );
};

export default ClientesPage;
