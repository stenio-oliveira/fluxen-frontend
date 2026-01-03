import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useState, useEffect, useCallback } from "react";
import DashboardEquipamentosSelector from "./DashboardEquipamentosSelector";
import ChartCard from "./ChartCard";
import UsuarioEquipamentoDashboardService from "../services/usuarioEquipamentoDashboardService";
import NotificacaoService from "../services/notificacaoService";
import type { UsuarioEquipamentoDashboard } from "../types/UsuarioEquipamentoDashboard";
import type { Notificacao } from "../types/Notificacao";

const Dashboard = () => {
  const {sideMenuOpen, sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const { user } = useSelector((state: RootState) => state.user);

  const [dashboardEquipamentos, setDashboardEquipamentos] = useState<UsuarioEquipamentoDashboard[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [notificacoesDrawerOpen, setNotificacoesDrawerOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [countNaoVisualizadas, setCountNaoVisualizadas] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);

  // Carregar equipamentos do dashboard
  const fetchDashboardEquipamentos = useCallback(async () => {
    if (!user?.id) return;

    setLoadingEquipamentos(true);
    try {
      const dashboardItems = await UsuarioEquipamentoDashboardService.getEquipamentosDashboard(user.id);
      setDashboardEquipamentos(dashboardItems);
    } catch (error) {
      console.error('Error fetching dashboard equipamentos:', error);
    } finally {
      setLoadingEquipamentos(false);
    }
  }, [user?.id]);

  // Buscar notificações a cada 1 minuto
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotificacoes = async () => {
      try {
        setLoadingNotificacoes(true);
        const [notificacoesData, count] = await Promise.all([
          NotificacaoService.getNotifications(),
          NotificacaoService.getUnreadCount()
        ]);
        setNotificacoes(notificacoesData);
        setCountNaoVisualizadas(count);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      } finally {
        setLoadingNotificacoes(false);
      }
    };

    // Buscar imediatamente
    fetchNotificacoes();

    // Configurar intervalo de 1 minuto
    const interval = setInterval(fetchNotificacoes, 60000);

    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardEquipamentos();
  }, [fetchDashboardEquipamentos]);


  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificacaoService.markAsRead(id);
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, visualizado: true } : n));
      setCountNaoVisualizadas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como visualizada:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificacaoService.markAllAsRead();
      setNotificacoes(prev => prev.map(n => ({ ...n, visualizado: true })));
      setCountNaoVisualizadas(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como visualizadas:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        marginLeft: sideMenuOpen ? sideMenuWidth : "0",
        bgcolor: "grey.100",
        width: "90vw",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{
        p: { xs: 2, md: 4 },
        pb: { xs: 1.5, md: 2 },
        flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', 

          mt: { 
            xs: 6,
            md: 4,
            lg: 0,
          },
          flexWrap: {
            xs: 'wrap',
          },
          gap: 1
         }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: 'primary.main' }}
          >
            Dashboard de Monitoramento
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Notificações">
              <IconButton
                onClick={() => setNotificacoesDrawerOpen(true)}
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={countNaoVisualizadas} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<SettingsIcon />}
              onClick={() => setSelectorOpen(true)}
            >
              Gerenciar Equipamentos
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Drawer de Notificações */}
      <Drawer
        anchor="right"
        open={notificacoesDrawerOpen}
        onClose={() => setNotificacoesDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" fontWeight="bold">
            Notificações
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {countNaoVisualizadas > 0 && (
              <Button
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAllAsRead}
              >
                Marcar todas
              </Button>
            )}
            <IconButton size="small" onClick={() => setNotificacoesDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          {loadingNotificacoes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notificacoes.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma notificação
              </Typography>
            </Box>
          ) : (
            <List>
              {notificacoes.map((notificacao, index) => (
                <Box key={notificacao.id}>
                  <ListItem
                    sx={{
                      bgcolor: notificacao.visualizado ? 'transparent' : 'action.hover',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 2
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        label={notificacao.visualizado ? 'Visualizada' : 'Nova'}
                        size="small"
                        color={notificacao.visualizado ? 'default' : 'error'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                      {!notificacao.visualizado && (
                        <Button
                          size="small"
                          onClick={() => handleMarkAsRead(notificacao.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </Box>
                    <ListItemText
                      primary={notificacao.descricao}
                      secondary={notificacao.created_at ? new Date(notificacao.created_at).toLocaleString('pt-BR') : ''}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '0.9rem',
                          fontWeight: notificacao.visualizado ? 400 : 600
                        }
                      }}
                      secondaryTypographyProps={{
                        sx: { fontSize: '0.75rem', mt: 0.5 }
                      }}
                    />
                  </ListItem>
                  {index < notificacoes.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

      {/* Seção Principal - Equipamentos Monitorados */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: { xs: 3, md: 4 },
          pt: { xs: 2, md: 2.5 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, color: 'text.primary', flexShrink: 0 }}
        >
          Meus Equipamentos Monitorados
        </Typography>

        {loadingEquipamentos ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress size={40} />
          </Box>
        ) : dashboardEquipamentos.length === 0 ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            color: 'text.secondary',
          }}>
            <Typography variant="h6" sx={{ mb: 1, fontStyle: 'italic' }}>
              Nenhum equipamento monitorado
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Use o botão "Gerenciar Equipamentos" para adicionar equipamentos ao seu dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => setSelectorOpen(true)}
            >
                Adicionar Equipamentos
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '10px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '5px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    },
                  },
                }}
              >
                <Grid container spacing={3} justifyContent="center">
                  {dashboardEquipamentos.map((dashboardItem) => (
                    <Grid
                      key={dashboardItem.id}
                      size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
                    >
                      <ChartCard
                        equipamentoId={dashboardItem.id_equipamento}
                        equipamentoNome={dashboardItem.equipamento?.nome || 'Equipamento'}
                        initialMetricId={dashboardItem.id_metrica || undefined}
                        dashboardItemId={dashboardItem.id}
                        initialTipoGraficoId={dashboardItem.id_tipo_grafico || undefined}
                        onTipoGraficoChange={fetchDashboardEquipamentos}
                      />
                    </Grid>
                  ))}
                </Grid>
          </Box>
        )}
      </Box>

      {/* Dialog de Seleção de Equipamentos */}
      {user && (
        <DashboardEquipamentosSelector
          user={user}
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          onUpdate={fetchDashboardEquipamentos}
        />
      )}
    </Box>
  );
};

export default Dashboard;
