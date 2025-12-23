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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota padrão - Dashboard (protegida) */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />

      {/* Redirecionamento para dashboard */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Rotas de autenticação */}
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* Rotas principais (protegidas) */}
      <Route path="/equipamentos" element={
        <ProtectedRoute>
          <EquipamentosPage />
        </ProtectedRoute>
      } />
      <Route path="/equipamentos/:id" element={
        <ProtectedRoute>
          <EquipamentoDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/equipamentos/:id/logs" element={
        <ProtectedRoute>
          <EquipamentoLogsPage />
        </ProtectedRoute>
      } />

      {/* Rotas protegidas para ADM e gestores */}
      <Route path="/clientes" element={
        <ProtectedRoute requiredRole="ADM" allowManager={true}>
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