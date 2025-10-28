import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux';
import UsersTable from '../tables/UsersTable'
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { People, AdminPanelSettings, CheckCircle } from '@mui/icons-material';
import type { RootState } from '../redux/store';

const UsersPage = () => {
  const { rows } = useSelector((state: RootState) => state.usersTable);

  const totalUsuarios = rows.length;
  const usuariosAdmin = rows.filter(user => user.perfil_nome === 'ADM').length;
  const usuariosAtivos = rows.filter(user => user.nome && user.email).length;


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "grey.50", p: 3, width: "90vw" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Usuários
      </Typography>

      <StatsContainer title="Estatísticas">
        <StatsCard
          title="Total de Usuários"
          value={totalUsuarios}
          icon={<People />}
          color="primary"
        />
        <StatsCard
          title="Administradores"
          value={usuariosAdmin}
          icon={<AdminPanelSettings />}
          color="warning"
        />
        <StatsCard
          title="Usuários Ativos"
          value={usuariosAtivos}
          icon={<CheckCircle />}
          color="success"
        />
      
      </StatsContainer>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <UsersTable />
      </Box>
    </Box>
  )
}

export default UsersPage