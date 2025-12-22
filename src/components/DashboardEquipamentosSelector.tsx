import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BaseCancelButton } from './shared/BaseCancelButton';
import EquipamentoService from '../services/equipamentoService';
import MetricaService from '../services/metricaService';
import UsuarioEquipamentoDashboardService from '../services/usuarioEquipamentoDashboardService';
import type { Equipamento } from '../types/Equipamento';
import type { Usuario } from '../types/Usuario';
import type { UsuarioEquipamentoDashboard } from '../types/UsuarioEquipamentoDashboard';
import type { Metrica } from '../types/Metrica';
import { useDispatch } from 'react-redux';
import { setFeedback } from '../redux/slices/feedBackSlice';

interface DashboardEquipamentosSelectorProps {
  user: Usuario;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const DashboardEquipamentosSelector: React.FC<DashboardEquipamentosSelectorProps> = ({
  user,
  open,
  onClose,
  onUpdate,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [availableEquipamentos, setAvailableEquipamentos] = useState<Equipamento[]>([]);
  const [selectedDashboardItems, setSelectedDashboardItems] = useState<UsuarioEquipamentoDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [equipamentoMetrics, setEquipamentoMetrics] = useState<Record<number, Metrica[]>>({});
  const [selectedEquipamentoForAdd, setSelectedEquipamentoForAdd] = useState<number | null>(null);
  const [selectedMetricForAdd, setSelectedMetricForAdd] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Buscar todos os equipamentos disponíveis para o usuário
      const allEquipamentos = await EquipamentoService.getEquipamentos(user, {
        generalFilter: '',
        columnFilters: {
            id: null,
            nome: null,
            cliente_nome: null
        },

      });

      console.log("allEquipamentos", allEquipamentos);

      // Buscar associações do dashboard
      const dashboardItems = await UsuarioEquipamentoDashboardService.getEquipamentosDashboard(user.id);

      // Buscar métricas para cada equipamento
      const metricsMap: Record<number, Metrica[]> = {};
      for (const equipamento of allEquipamentos) {
        try {
          const metrics = await MetricaService.getMetricaByEquipamentoId(equipamento.id);
          metricsMap[equipamento.id] = metrics;
        } catch (error) {
          console.error(`Erro ao buscar métricas do equipamento ${equipamento.id}:`, error);
          metricsMap[equipamento.id] = [];
        }
      }

      setEquipamentoMetrics(metricsMap);
      setSelectedDashboardItems(dashboardItems);
      setAvailableEquipamentos(allEquipamentos);
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao carregar equipamentos: ${error.message || 'Erro desconhecido'}`,
          type: 'error',
        })
      );
      console.error('Error fetching equipamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  const handleAddEquipamento = async () => {
    if (!user?.id || !selectedEquipamentoForAdd) return;

    const equipamento = availableEquipamentos.find(eq => eq.id === selectedEquipamentoForAdd);
    if (!equipamento) return;

    setSaving(true);
    try {
      const newItem = await UsuarioEquipamentoDashboardService.addEquipamentoToDashboard(
        user.id,
        selectedEquipamentoForAdd,
        selectedMetricForAdd || null
      );
      
      // Atualizar listas localmente
      setSelectedDashboardItems(prev => [...prev, newItem]);
      
      dispatch(
        setFeedback({
          message: `Equipamento "${equipamento.nome}" ${selectedMetricForAdd ? 'com métrica selecionada' : ''} adicionado ao dashboard`,
          type: 'success',
        })
      );
      
      // Resetar seleções
      setSelectedEquipamentoForAdd(null);
      setSelectedMetricForAdd(null);
      
      onUpdate();
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao adicionar equipamento: ${error.message || 'Erro desconhecido'}`,
          type: 'error',
        })
      );
      console.error('Error adding equipamento:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEquipamentoSelect = async (equipamentoId: number) => {
    setSelectedEquipamentoForAdd(equipamentoId);
    setSelectedMetricForAdd(null);
    
    // Se não temos as métricas ainda, buscar
    if (!equipamentoMetrics[equipamentoId]) {
      try {
        const metrics = await MetricaService.getMetricaByEquipamentoId(equipamentoId);
        setEquipamentoMetrics(prev => ({ ...prev, [equipamentoId]: metrics }));
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    }
  };

  const handleRemoveEquipamento = async (dashboardItem: UsuarioEquipamentoDashboard) => {
    if (!dashboardItem.id) return;

    setSaving(true);
    try {
      await UsuarioEquipamentoDashboardService.removeEquipamentoFromDashboardById(dashboardItem.id);
      
      // Atualizar listas localmente
      setSelectedDashboardItems(prev => prev.filter(item => item.id !== dashboardItem.id));
      
      const equipamentoNome = dashboardItem.equipamento?.nome || 'Equipamento';
      dispatch(
        setFeedback({
          message: `Equipamento "${equipamentoNome}" removido do dashboard`,
          type: 'success',
        })
      );
      
      onUpdate();
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao remover equipamento: ${error.message || 'Erro desconhecido'}`,
          type: 'error',
        })
      );
      console.error('Error removing equipamento:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? 'sm' : 'md'}
      fullWidth
    >
      <DialogTitle
        sx={{
          color: 'primary.main',
          fontSize: isMobile ? '1rem' : '1.25rem',
        }}
      >
        Gerenciar Equipamentos do Dashboard
      </DialogTitle>
      
      <DialogContent sx={{ minHeight: isMobile ? 300 : 400, p: isMobile ? 1.5 : 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Equipamentos Selecionados */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
                Equipamentos no Dashboard ({selectedDashboardItems.length})
              </Typography>
              {selectedDashboardItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Nenhum equipamento selecionado. Adicione equipamentos abaixo.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedDashboardItems.map((dashboardItem) => {
                    const equipamentoNome = dashboardItem.equipamento?.nome || 'Equipamento';
                    const metricaNome = dashboardItem.metrica ? ` - ${dashboardItem.metrica.nome}` : '';
                    return (
                      <Chip
                        key={dashboardItem.id}
                        label={`${equipamentoNome}${metricaNome}`}
                        onDelete={() => handleRemoveEquipamento(dashboardItem)}
                        deleteIcon={<CloseIcon />}
                        color="primary"
                        variant="filled"
                        disabled={saving}
                        sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* Adicionar Novo Equipamento */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
                Adicionar Equipamento ao Dashboard
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Equipamento</InputLabel>
                  <Select
                    value={selectedEquipamentoForAdd || ''}
                    onChange={(e) => handleEquipamentoSelect(Number(e.target.value))}
                    label="Equipamento"
                    disabled={saving}
                  >
                    {availableEquipamentos.map((equipamento) => (
                      <MenuItem key={equipamento.id} value={equipamento.id}>
                        {equipamento.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedEquipamentoForAdd && equipamentoMetrics[selectedEquipamentoForAdd] && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Métrica (Opcional)</InputLabel>
                    <Select
                      value={selectedMetricForAdd || ''}
                      onChange={(e) => setSelectedMetricForAdd(e.target.value ? Number(e.target.value) : null)}
                      label="Métrica (Opcional)"
                      disabled={saving}
                    >
                      <MenuItem value="">
                        <em>Nenhuma (todas as métricas)</em>
                      </MenuItem>
                      {equipamentoMetrics[selectedEquipamentoForAdd].map((metrica) => (
                        <MenuItem key={metrica.id} value={metrica.id}>
                          {metrica.nome} ({metrica.unidade})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {selectedEquipamentoForAdd && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip
                      icon={<AddIcon />}
                      label="Adicionar"
                      onClick={handleAddEquipamento}
                      color="primary"
                      variant="outlined"
                      disabled={saving}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    />
                  </Box>
                )}

                {availableEquipamentos.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Nenhum equipamento disponível para adicionar.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: isMobile ? 1.5 : 2 }}>
        <BaseCancelButton onClick={onClose} disabled={saving}>
          Fechar
        </BaseCancelButton>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardEquipamentosSelector;


