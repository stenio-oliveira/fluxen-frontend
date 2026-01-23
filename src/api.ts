import axios from 'axios';
import { store } from './redux/store';
import { logout } from './redux/slices/userSlice';

const api = axios.create({
  // baseURL: 'http://localhost:3000', // Atualize com a URL do backend
  baseURL: 'https://api.fluxen.cloud',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Injetar tenantId do usuário em todas as requisições
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.id_tenant) {
        config.headers['X-Tenant-Id'] = user.id_tenant.toString();
      }
    } catch (error) {
      console.error('Erro ao parsear dados do usuário para obter tenantId:', error);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Só redireciona se não estiver já em uma rota pública
      const publicRoutes = ['/auth', '/register', '/forgot-password', '/reset-password'];
      if (!publicRoutes.includes(window.location.pathname)) {
        // Limpa o estado do Redux
        store.dispatch(logout());
        // Limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redireciona para auth
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;