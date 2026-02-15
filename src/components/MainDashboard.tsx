import {
  Box,
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
import { useSystemAnnouncement } from "../hooks/useSystemAnnouncement";
import SystemAnnouncementCard from "./SystemAnnouncementCard";
import type { UsuarioEquipamentoDashboard } from "../types/UsuarioEquipamentoDashboard";
import type { Notificacao } from "../types/Notificacao";

const Dashboard = () => {
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const { user } = useSelector((state: RootState) => state.user);

  const [dashboardEquipamentos, setDashboardEquipamentos] = useState<UsuarioEquipamentoDashboard[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [notificacoesDrawerOpen, setNotificacoesDrawerOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [countNaoVisualizadas, setCountNaoVisualizadas] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const { activeAnnouncement, isContingency } = useSystemAnnouncement();

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
        marginLeft: sideMenuWidth,
        bgcolor: "#F4F7F9",
        width: `calc(100vw - ${sideMenuWidth})`,
        overflow: 'hidden',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      {/* Header */}
      <Box sx={{
        px: { xs: 1, md: 1.5 },
        py: { xs: 0.5, md: 0.75 },
        flexShrink: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.04)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: {
            xs: 'wrap',
          },
          gap: 1
         }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ 
                color: '#00204a',
                fontSize: { xs: '0.85rem', md: '0.9rem' },
                lineHeight: 1.2,
              }}
            >
              Dashboard de Monitoramento
            </Typography>
            {/* <Typography
              variant="body2"
              sx={{
                color: '#00204a',
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                fontWeight: 500,
                mt: 0.15,
                opacity: 0.8,
              }}
            >
              Meus Equipamentos Monitorados
            </Typography> */}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Notificações">
              <IconButton
                onClick={() => setNotificacoesDrawerOpen(true)}
                size="small"
                sx={{ 
                  position: 'relative',
                  color: 'text.primary',
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 35, 126, 0.08)',
                    color: 'primary.main',
                  },
                }}
              >
                <Badge badgeContent={countNaoVisualizadas} color="error">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              startIcon={<SettingsIcon fontSize="small" />}
              onClick={() => setSelectorOpen(true)}
              sx={{
                backgroundColor: '#1FB6D5',
                fontSize: '0.7rem',
                py: 0.4,
                px: 1,
                minHeight: '28px',
                '&:hover': {
                  backgroundColor: '#1599B8',
                },
              }}
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
          p: { xs: 1, md: 1 },
          pt: { xs: 1, md: 1 },
        }}
      >
        {/* Exibir anúncio ativo se houver (apenas para não administradores) */}
        {activeAnnouncement && user?.perfil_nome !== 'ADM' && (
          <Box sx={{ mb: 2 }}>
            <SystemAnnouncementCard announcement={activeAnnouncement} fullWidth />
          </Box>
        )}

        {/* Se houver anúncio de contingência, não mostrar os gráficos (apenas para não administradores) */}
        {isContingency && user?.perfil_nome !== 'ADM' ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            color: 'text.secondary',
          }}>
            <Typography variant="h6" sx={{ mb: 1, fontStyle: 'italic', textAlign: 'center' }}>
              Sistema em modo de contingência
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: 600 }}>
              O sistema está temporariamente indisponível devido a uma contingência. 
              Por favor, verifique o anúncio acima para mais informações.
            </Typography>
          </Box>
        ) : loadingEquipamentos ? (
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
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}
                >
                  {dashboardEquipamentos.map((dashboardItem) => (
                    <Box
                      key={dashboardItem.id}
                      sx={{
                        minWidth: '200px',
                        height: '290px',
                        flex: '1 1 auto',
                        maxWidth: '200px',
                     
                        display: 'flex',
                      }}
                    >
                      <ChartCard
                        equipamentoId={dashboardItem.id_equipamento}
                        equipamentoNome={dashboardItem.equipamento?.nome || 'Equipamento'}
                        initialMetricId={dashboardItem.id_metrica || undefined}
                        dashboardItemId={dashboardItem.id}
                        initialTipoGraficoId={dashboardItem.id_tipo_grafico || undefined}
                        onTipoGraficoChange={fetchDashboardEquipamentos}
                      />
                    </Box>
                  ))}
                </Box>
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
