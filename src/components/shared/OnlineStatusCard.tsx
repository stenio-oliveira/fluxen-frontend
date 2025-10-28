import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';

interface OnlineStatusCardProps {
  isOnline: boolean;
  lastUpdate: Date | null;
  isRefreshing?: boolean;
}

const StyledCard = styled(Card)<{ isOnline: boolean }>(({ theme, isOnline }) => ({
  minHeight: 60,
  background: isOnline 
    ? `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)`
    : `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}05)`,
  border: `1px solid ${isOnline ? theme.palette.success.main : theme.palette.error.main}30`,
  borderRadius: 8,
  transition: 'all 0.3s ease',
}));

const OnlineStatusCard: React.FC<OnlineStatusCardProps> = ({ 
  isOnline, 
  lastUpdate, 
  isRefreshing = false 
}) => {
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffSeconds < 60) return `${diffSeconds}s atrás`;
    if (diffMinutes < 60) return `${diffMinutes}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString();
  };

  return (
    <StyledCard isOnline={isOnline} elevation={0}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isRefreshing ? (
              <Refresh sx={{ 
                color: 'text.secondary', 
                fontSize: 20,
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }} />
            ) : isOnline ? (
              <Wifi sx={{ color: 'success.main', fontSize: 20 }} />
            ) : (
              <WifiOff sx={{ color: 'error.main', fontSize: 20 }} />
            )}
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: 1
                }}
              >
                Status do Equipamento
              </Typography>
              <Chip
                label={isOnline ? 'Online' : 'Offline'}
                size="small"
                color={isOnline ? 'success' : 'error'}
                variant="filled"
                sx={{ 
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.65rem',
                color: 'text.secondary',
                display: 'block'
              }}
            >
              Última atualização
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {formatLastUpdate(lastUpdate)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default OnlineStatusCard;
