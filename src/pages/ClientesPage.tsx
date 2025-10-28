import { Box, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ClientesTable from '../tables/ClientesTable';
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { Business, Person, Assignment, Warning } from '@mui/icons-material';
import type { RootState } from '../redux/store';

const ClientesPage: React.FC = () => {
  const { rows } = useSelector((state: RootState) => state.clientesTable);

  const totalClientes = rows.length;
  const clientesComCnpj = rows.filter(cliente => cliente.cnpj).length;
  const clientesSemResponsavel = rows.filter(cliente => !cliente.id_responsavel).length;
  // const clientesComEquipamentos = rows.filter(cliente => cliente.equipamento && cliente.equipamento.length > 0).length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "grey.50", 
        p: 3,
        width: "90vw",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
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
        <StatsCard
          title="Sem Responsável"
          value={clientesSemResponsavel}
          icon={<Warning />}
          color="warning"
        />
        {/* <StatsCard
          title="Com Equipamentos"
          value={clientesComEquipamentos}
          icon={<Person />}
          color="info"
        /> */}
      </StatsContainer>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ClientesTable />
      </Box>
    </Box>
  );
};

export default ClientesPage;
