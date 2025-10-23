import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Box, Typography, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
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
  if (requiredRole && user.perfil_nome !== requiredRole) {
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
          Apenas usuários com perfil "{requiredRole}" podem acessar esta área.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
