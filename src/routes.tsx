import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage /> } />
        <Route path="/equipamentos" element={<EquipamentosPage />} />
        <Route path="/equipamentos/:id" element={<EquipamentoDetailPage />} />
        <Route path="/equipamentos/:id/logs" element={<EquipamentoLogsPage />} />
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
    </Routes>
  );
};

export default AppRoutes;