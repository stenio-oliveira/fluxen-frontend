import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StatsContainerProps {
  title: string;
  children: React.ReactNode;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .stats-title': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  '& .stats-grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
}));

const StatsContainer: React.FC<StatsContainerProps> = ({ title, children }) => {
  return (
    <StyledContainer>
      <Typography className="stats-title" variant="h5">
        {title}
      </Typography>
      <Box className="stats-grid">
        {children}
      </Box>
    </StyledContainer>
  );
};

export default StatsContainer;
