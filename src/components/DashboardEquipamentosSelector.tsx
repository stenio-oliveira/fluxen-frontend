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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BaseButton } from './shared/Button';
import { BaseCancelButton } from './shared/BaseCancelButton';
import EquipamentoService from '../services/equipamentoService';
import UsuarioEquipamentoDashboardService from '../services/usuarioEquipamentoDashboardService';
import type { Equipamento } from '../types/Equipamento';
import type { Usuario } from '../types/Usuario';
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
  const [selectedEquipamentos, setSelectedEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

      // Buscar equipamentos já selecionados no dashboard
      const dashboardEquipamentos = await UsuarioEquipamentoDashboardService.getEquipamentos(user.id);

      // Separar disponíveis e selecionados
      const selectedIds = new Set(dashboardEquipamentos.map(eq => eq.id));
      const available = allEquipamentos.filter(eq => !selectedIds.has(eq.id));
      const selected = allEquipamentos.filter(eq => selectedIds.has(eq.id));

      setAvailableEquipamentos(available);
      setSelectedEquipamentos(selected);
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

  const handleAddEquipamento = async (equipamento: Equipamento) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await UsuarioEquipamentoDashboardService.addEquipamentoToDashboard(user.id, equipamento.id);
      
      // Atualizar listas localmente
      setSelectedEquipamentos(prev => [...prev, equipamento]);
      setAvailableEquipamentos(prev => prev.filter(eq => eq.id !== equipamento.id));
      
      dispatch(
        setFeedback({
          message: `Equipamento "${equipamento.nome}" adicionado ao dashboard`,
          type: 'success',
        })
      );
      
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

  const handleRemoveEquipamento = async (equipamento: Equipamento) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await UsuarioEquipamentoDashboardService.removeEquipamentoFromDashboard(user.id, equipamento.id);
      
      // Atualizar listas localmente
      setAvailableEquipamentos(prev => [...prev, equipamento]);
      setSelectedEquipamentos(prev => prev.filter(eq => eq.id !== equipamento.id));
      
      dispatch(
        setFeedback({
          message: `Equipamento "${equipamento.nome}" removido do dashboard`,
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
                Equipamentos no Dashboard ({selectedEquipamentos.length})
              </Typography>
              {selectedEquipamentos.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Nenhum equipamento selecionado. Adicione equipamentos abaixo.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedEquipamentos.map((equipamento) => (
                    <Chip
                      key={equipamento.id}
                      label={equipamento.nome}
                      onDelete={() => handleRemoveEquipamento(equipamento)}
                      deleteIcon={<CloseIcon />}
                      color="primary"
                      variant="filled"
                      disabled={saving}
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Equipamentos Disponíveis */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
                Equipamentos Disponíveis ({availableEquipamentos.length})
              </Typography>
              {availableEquipamentos.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Todos os equipamentos já estão no dashboard.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableEquipamentos.map((equipamento) => (
                    <Chip
                      key={equipamento.id}
                      label={equipamento.nome}
                      onClick={() => handleAddEquipamento(equipamento)}
                      icon={<AddIcon />}
                      color="default"
                      variant="outlined"
                      disabled={saving}
                      sx={{
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
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


