import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import type { SystemAnnouncement, SystemAnnouncementType } from '../types/SystemAnnouncement';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import ErrorIcon from '@mui/icons-material/Error';

interface SystemAnnouncementCardProps {
  announcement: SystemAnnouncement;
  fullWidth?: boolean;
}

const getTypeConfig = (type: SystemAnnouncementType) => {
  switch (type) {
    case 'CONTINGENCY':
      return {
        color: 'error' as const,
        icon: <ErrorIcon />,
        label: 'Contingência',
        bgColor: '#ffebee',
        borderColor: '#f44336',
      };
    case 'CRITICAL':
      return {
        color: 'error' as const,
        icon: <WarningIcon />,
        label: 'Crítico',
        bgColor: '#ffebee',
        borderColor: '#f44336',
      };
    case 'MAINTENANCE':
      return {
        color: 'warning' as const,
        icon: <BuildIcon />,
        label: 'Manutenção',
        bgColor: '#fff3e0',
        borderColor: '#ff9800',
      };
    case 'INFO':
      return {
        color: 'info' as const,
        icon: <InfoIcon />,
        label: 'Informação',
        bgColor: '#e3f2fd',
        borderColor: '#2196f3',
      };
    default:
      return {
        color: 'default' as const,
        icon: <InfoIcon />,
        label: type,
        bgColor: '#f5f5f5',
        borderColor: '#9e9e9e',
      };
  }
};

const SystemAnnouncementCard: React.FC<SystemAnnouncementCardProps> = ({ announcement, fullWidth = false }) => {
  const typeConfig = getTypeConfig(announcement.type);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: typeConfig.bgColor,
        borderLeft: `4px solid ${typeConfig.borderColor}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ color: typeConfig.borderColor, display: 'flex', alignItems: 'center' }}>
          {typeConfig.icon}
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: typeConfig.borderColor, flex: 1 }}>
          {announcement.title}
        </Typography>
        <Chip
          icon={typeConfig.icon}
          label={typeConfig.label}
          color={typeConfig.color}
          sx={{ fontWeight: 600 }}
        />
      </Box>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          lineHeight: 1.8,
          color: 'text.primary',
        }}
      >
        {announcement.description}
      </Typography>
      {announcement.ends_at && (
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          Período: {new Date(announcement.starts_at).toLocaleString('pt-BR')} até {new Date(announcement.ends_at).toLocaleString('pt-BR')}
        </Typography>
      )}
    </Paper>
  );
};

export default SystemAnnouncementCard;
