import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

const StyledCard = styled(Card)<{ color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' }>(({ theme, color = 'primary' }) => ({
  minHeight: 80,
  background: `linear-gradient(135deg, ${theme.palette[color as keyof typeof theme.palette]}15, ${theme.palette[color as keyof typeof theme.palette]}05)`,
  border: `1px solid ${theme.palette[color as keyof typeof theme.palette]}30`,
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${theme.palette[color as keyof typeof theme.palette]}20`,
  },
}));

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  loading = false 
}) => {
  return (
    <StyledCard color={color} elevation={0}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                color: `${color}.main`,
                lineHeight: 1.2
              }}
            >
              {loading ? '...' : value}
            </Typography>
          </Box>
          {icon && (
            <Box sx={{ 
              color: `${color}.main`,
              opacity: 0.8,
              ml: 1
            }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
