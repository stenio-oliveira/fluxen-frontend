import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EquipamentosPage from './pages/EquipamentosPage';
import ClientesPage from './pages/ClientesPage';
import UsersPage from './pages/UsersPage';
import MetricasPage from './pages/MetricasPage';
import EquipamentoDetailPage from './pages/EquipamentoDetailPage';
import EquipamentoLogsPage from './pages/EquipamentoLogsPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota padrão - Dashboard */}
      <Route path="/" element={<HomePage />} />

      {/* Redirecionamento para dashboard */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Rotas de autenticação */}
      <Route path="/auth" element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* Rotas principais */}
      <Route path="/equipamentos" element={<EquipamentosPage />} />
      <Route path="/equipamentos/:id" element={<EquipamentoDetailPage />} />
      <Route path="/equipamentos/:id/logs" element={<EquipamentoLogsPage />} />

      {/* Rotas protegidas para ADM */}
      <Route path="/clientes" element={
        <ProtectedRoute requiredRole="ADM">
          <ClientesPage />
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute requiredRole="ADM">
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/metricas" element={
        <ProtectedRoute requiredRole="ADM">
          <MetricasPage />
        </ProtectedRoute>
      } />

      {/* Rota catch-all - redireciona para dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;