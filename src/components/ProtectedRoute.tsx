import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Box, Typography, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowManager?: boolean; // Permite gestores além do role requerido
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, allowManager = false }) => {
  const { user, isAuthChecking } = useSelector((state: RootState) => state.user);

  // Se ainda está verificando autenticação, mostrar loading
  if (isAuthChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se não há usuário logado, redirecionar para login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se há um role específico requerido, verificar
  if (requiredRole) {
    const isAdmin = user.perfil_nome === requiredRole;
    const isManager = allowManager && user.is_gestor === true;
    
    if (!isAdmin && !isManager) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 2,
          }}
        >
          <Typography variant="h4" color="error">
            Acesso Negado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você não tem permissão para acessar esta página.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {allowManager 
              ? `Apenas usuários com perfil "${requiredRole}" ou gestores podem acessar esta área.`
              : `Apenas usuários com perfil "${requiredRole}" podem acessar esta área.`
            }
          </Typography>
        </Box>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
