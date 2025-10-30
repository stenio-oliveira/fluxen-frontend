import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import SideMenu from './components/shared/SideMenu';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import SnackBar from './components/shared/SnackBar';
import { login, setAuthChecking } from './redux/slices/userSlice';
import type { Usuario } from './types/Usuario';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { RootState } from './redux/store';

// Componente interno que inicializa o estado do usuário
const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthChecking } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const isJwtValid = (jwtToken: string): boolean => {
      try {
        const payloadBase64 = jwtToken.split('.')[1];
        if (!payloadBase64) return false;
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        if (!payload.exp) return false;
        const nowSeconds = Math.floor(Date.now() / 1000);
        return payload.exp > nowSeconds;
      } catch {
        return false;
      }
    };

    // Verifica se há dados do usuário no localStorage e validade do token
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData && isJwtValid(token)) {
      try {
        const user: Usuario = JSON.parse(userData);
        dispatch(login({ user }));
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(setAuthChecking(false));
        navigate('/auth', { replace: true });
      }
    } else {
      // Token ausente/inválido: limpar e redirecionar para autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(setAuthChecking(false));
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/register') {
        navigate('/auth', { replace: true });
      }
    }
  }, [dispatch, navigate]);

  // Mostrar loading enquanto verifica autenticação
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

  return (
    <>
      <SideMenu />
      <AppRoutes />
      <SnackBar />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
