import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import SystemAnnouncementsTable from '../tables/SystemAnnouncementsTable';
import type { RootState } from '../redux/store';

const SystemAnnouncementsPage: React.FC = () => {
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: isMobile ? 2 : 3,
        pt: isMobile ? 6 : 3,
        marginLeft: sideMenuWidth,
        width: `calc(100vw - ${sideMenuWidth})`,
        maxWidth: '100%',
        boxSizing: 'border-box',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          mb: isMobile ? 2 : 3,
          mt: isMobile ? 2 : 0,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Anúncios do Sistema
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SystemAnnouncementsTable />
      </Box>
    </Box>
  );
};

export default SystemAnnouncementsPage;
