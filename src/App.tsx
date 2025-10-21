import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import SideMenu from './components/shared/SideMenu';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import SnackBar from './components/shared/SnackBar';
import { login } from './redux/slices/userSlice';
import type { Usuario } from './types/Usuario';

// Componente interno que inicializa o estado do usuário
const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Verifica se há dados do usuário no localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user: Usuario = JSON.parse(userData);
        dispatch(login({ user }));
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        // Remove dados inválidos do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

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
        <AppContent />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
