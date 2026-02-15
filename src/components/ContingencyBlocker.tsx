import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSystemAnnouncement } from '../hooks/useSystemAnnouncement';
import SystemAnnouncementCard from './SystemAnnouncementCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface ContingencyBlockerProps {
  children: React.ReactNode;
}

const ContingencyBlocker: React.FC<ContingencyBlockerProps> = ({ children }) => {
  const { activeAnnouncement, isContingency, loading } = useSystemAnnouncement();
  const { user } = useSelector((state: RootState) => state.user);

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          marginLeft: 0,
        }}
      >
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  // Se é admin, sempre permitir acesso (mesmo com contingência)
  const isAdmin = user?.perfil_nome === 'ADM';
  if (isAdmin) {
    return <>{children}</>;
  }

  // Se há contingência ativa, bloquear acesso
  if (isContingency && activeAnnouncement) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'grey.50',
          p: 3,
          marginLeft: 0,
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 800,
            width: '100%',
          }}
        >
          <SystemAnnouncementCard announcement={activeAnnouncement} fullWidth />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              O acesso a esta área está temporariamente bloqueado devido a uma contingência no sistema.
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Sem contingência, permitir acesso normal
  return <>{children}</>;
};

export default ContingencyBlocker;
