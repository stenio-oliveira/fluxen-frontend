import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Popover,
  Divider,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import ChartService from '../services/chartService';
import MetricaService from '../services/metricaService';
import UsuarioEquipamentoDashboardService from '../services/usuarioEquipamentoDashboardService';
import type { ChartData, ChartType, TimeRange } from '../types/Chart';
import type { Metrica } from '../types/Metrica';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Plugin personalizado para exibir valor central no gráfico de rosca
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart: any) => {
    // Só executar para gráficos de rosca
    if (chart.config.type !== 'doughnut') return;

    // Obter metadata das opções do gráfico
    const metadata = chart.options?.metadata || chart.config.options?.metadata;
    if (!metadata || metadata.currentValue === undefined) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    // Verificar se chartArea existe (pode não existir se o gráfico ainda não foi renderizado)
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    const currentValue = metadata.currentValue;
    const unidade = metadata.metrica?.unidade || '';

    ctx.save();

    // Calcular tamanho da fonte baseado no tamanho do gráfico
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    const minDimension = Math.min(chartWidth, chartHeight);
    const fontSize = Math.max(16, minDimension / 12); // Fonte responsiva, mínimo 16px (reduzido)

    // Desenhar valor principal em destaque (maior e mais visível)
    ctx.fillStyle = 'black';
    ctx.font = `bold 18px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = `${currentValue.toFixed(2)}`;
    ctx.fillText(text, centerX, centerY - fontSize * 0.2);

    // Desenhar unidade abaixo do valor
    ctx.fillStyle = '#666666';
    ctx.font = `bold ${fontSize * 0.45}px Arial`;
    ctx.fillText(unidade, centerX, centerY + fontSize * 0.4);

    ctx.restore();
  },
};

// Registrar plugin globalmente
ChartJS.register(centerTextPlugin);

interface ChartCardProps {
  equipamentoId: number;
  equipamentoNome: string;
  initialMetricId?: number;
  dashboardItemId?: number;
  initialTipoGraficoId?: number;
  onTipoGraficoChange?: () => void;
}

// Mapeamento entre id_tipo_grafico e ChartType
const tipoGraficoToChartType = (id: number): ChartType => {
  switch (id) {
    case 1: return 'doughnut'; // rosca
    case 2: return 'bar'; // barras
    case 3: return 'line'; // linha
    default: return 'line';
  }
};

// Mapeamento entre ChartType e id_tipo_grafico
const chartTypeToTipoGraficoId = (chartType: ChartType): number => {
  switch (chartType) {
    case 'doughnut': return 1; // rosca
    case 'bar': return 2; // barras
    case 'line': return 3; // linha
    default: return 3;
  }
};

const ChartCard: React.FC<ChartCardProps> = ({
  equipamentoId,
  equipamentoNome,
  initialMetricId,
  dashboardItemId,
  initialTipoGraficoId,
  onTipoGraficoChange
}) => {
  const [chartType, setChartType] = useState<ChartType>(
    initialTipoGraficoId ? tipoGraficoToChartType(initialTipoGraficoId) : 'line'
  );
  const [selectedMetric, setSelectedMetric] = useState<number | ''>(initialMetricId || '');
  const [timeRange, setTimeRange] = useState<TimeRange>('5min');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [metrics, setMetrics] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<HTMLElement | null>(null);
  const refreshIntervalRef = useRef<number | null>(null);

  const settingsOpen = Boolean(settingsAnchorEl);

  // Atualizar tipo de gráfico quando initialTipoGraficoId mudar
  useEffect(() => {
    if (initialTipoGraficoId) {
      const newChartType = tipoGraficoToChartType(initialTipoGraficoId);
      setChartType(newChartType);
    }
  }, [initialTipoGraficoId]);

  // Buscar métricas do equipamento
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const equipamentoMetrics = await MetricaService.getMetricaByEquipamentoId(equipamentoId);
        setMetrics(equipamentoMetrics);
        if (equipamentoMetrics.length > 0) {
          // Se há initialMetricId e ele existe nas métricas, usar ele; senão, usar a primeira métrica disponível
          if (initialMetricId && equipamentoMetrics.some(m => m.id === initialMetricId)) {
            setSelectedMetric(initialMetricId);
          } else if (!selectedMetric) {
            setSelectedMetric(equipamentoMetrics[0].id);
          }
        }
      } catch (err: any) {
        setError(`Erro ao buscar métricas: ${err.message}`);
      }
    };

    fetchMetrics();
  }, [equipamentoId, initialMetricId]);

  // Buscar dados do gráfico
  const fetchChartData = async () => {
    if (typeof selectedMetric !== 'number') {
      setChartData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: ChartData;

      switch (chartType) {
        case 'line':
          data = await ChartService.getLineChartData(equipamentoId, selectedMetric, timeRange);
          break;
        case 'doughnut':
          data = await ChartService.getDoughnutChartData(equipamentoId, selectedMetric);
          break;
        case 'bar':
          data = await ChartService.getBarChartData(equipamentoId, selectedMetric, timeRange);
          break;
        default:
          throw new Error('Tipo de gráfico não suportado');
      }

      setChartData(data);
    } catch (err: any) {
      setError(`Erro ao buscar dados do gráfico: ${err.message}`);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar gráfico quando mudar tipo, métrica ou intervalo
  useEffect(() => {
    fetchChartData();

    // Limpar intervalo anterior
    if (refreshIntervalRef.current !== null) {
      clearInterval(refreshIntervalRef.current);
    }

    // Configurar atualização automática (a cada 30 segundos para gráficos com intervalo de tempo)
    if (chartType !== 'doughnut') {
      refreshIntervalRef.current = window.setInterval(() => {
        fetchChartData();
      }, 30000);
    } else {
      // Para gráfico de rosca, atualizar a cada 10 segundos
      refreshIntervalRef.current = window.setInterval(() => {
        fetchChartData();
      }, 10000);
    }

    return () => {
      if (refreshIntervalRef.current !== null) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [chartType, selectedMetric, timeRange]);

  const handleRefresh = () => {
    fetchChartData();
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const renderChart = () => {
    if (!chartData) return null;

    // Aplicar estilizações aos datasets baseado no tipo de gráfico
    const styledChartData = {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => {
        const baseDataset = { ...dataset };

        switch (chartType) {
          case 'line':
            return {
              ...baseDataset,
              borderColor: '#1FB6D5',
              backgroundColor: 'rgba(31, 182, 213, 0.3)',
              borderWidth: 2,
            };
          case 'bar':
            return {
              ...baseDataset,
              backgroundColor: 'rgba(31, 182, 213, 0.8)',
              borderColor: '#1FB6D5',
              borderWidth: 1,
            };
          case 'doughnut':
            return {
              ...baseDataset,
              backgroundColor: [
                'rgba(31, 182, 213, 0.8)',  // Preenchido - ciano tech
                'rgba(217, 222, 227, 0.8)'  // Restante - cinza claro
              ],
              borderColor: [
                '#1FB6D5',  // Preenchido
                '#D9DEE3'   // Restante
              ],
              borderWidth: 1,
            };
          default:
            return baseDataset;
        }
      }),
    };

    const chartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `${chartData.metadata.metrica.nome} (${chartData.metadata.metrica.unidade})`,
        },
      },
      // Passar metadata através das opções para o plugin acessar
      metadata: chartData.metadata,
    };

    // Configurar cutout para gráfico de rosca (aumenta o buraco interno, deixando o anel mais fino)
    if (chartType === 'doughnut') {
      chartOptions.cutout = '75%'; // Aumenta o buraco interno, deixando o anel mais fino
    }

    // Configurar eixo Y para gráficos de linha e barra usando valor_maximo e valor_minimo
    if ((chartType === 'line' || chartType === 'bar') && chartData.metadata.maxValue !== undefined && chartData.metadata.minValue !== undefined) {
      chartOptions.scales = {
        y: {
          min: chartData.metadata.minValue,
          max: chartData.metadata.maxValue,
          ticks: {
            stepSize: (chartData.metadata.maxValue - chartData.metadata.minValue) / 10,
          },
        },
        x: {
          ticks: {
            display: fullscreenOpen, // Mostrar timestamp apenas em tela cheia
          },
        },
      };
    } else if ((chartType === 'line' || chartType === 'bar')) {
      // Mesmo sem valor_maximo e valor_minimo, ocultar timestamp quando não estiver em tela cheia
      chartOptions.scales = {
        x: {
          ticks: {
            display: fullscreenOpen, // Mostrar timestamp apenas em tela cheia
          },
        },
      };
    }

    switch (chartType) {
      case 'line':
        return <Line data={styledChartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={styledChartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={styledChartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        boxShadow: '0px 6px 18px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.05)',
        borderTop: '3px solid #1FB6D5',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1 }}>
        {/* Cabeçalho com nome e ID do equipamento */}
        <Box sx={{ 
          mb: 0.1,
          pb: 0.1, 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <Box>
            <Typography
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 0.25,
              color: '#00204a',
              fontSize: '0.9rem',
            }}
            >
              {equipamentoNome}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              ID: {equipamentoId}
            </Typography>
          </Box>
          <Tooltip title="Configurações">
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{
                mt: -0.5,
                color: '#00204a',
                '&:hover': {
                  backgroundColor: 'rgba(10, 90, 110, 0.08)',
                },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Visualizar em tela cheia">
            <IconButton
              size="small"
              onClick={() => setFullscreenOpen(true)}
              sx={{
                mt: -0.5,
                color: '#00204a',
                '&:hover': {
                  backgroundColor: 'rgba(10, 90, 110, 0.08)',
                },
              }}
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Popover de Configurações */}
        <Popover
          open={settingsOpen}
          anchorEl={settingsAnchorEl}
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 0.5,
              minWidth: 200,
              maxWidth: 280,
              p: 1.5,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#00204a' }}>
            Configurações do Gráfico
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Tipo de Gráfico</InputLabel>
              <Select
                value={chartType}
                label="Tipo de Gráfico"
                onChange={async (e) => {
                  const newChartType = e.target.value as ChartType;
                  const previousChartType = chartType;
                  setChartType(newChartType);

                  // Atualizar no backend se dashboardItemId estiver disponível
                  if (dashboardItemId && onTipoGraficoChange) {
                    try {
                      const newTipoGraficoId = chartTypeToTipoGraficoId(newChartType);
                      await UsuarioEquipamentoDashboardService.updateTipoGrafico(
                        dashboardItemId,
                        newTipoGraficoId
                      );
                      onTipoGraficoChange();
                    } catch (error) {
                      console.error('Erro ao atualizar tipo de gráfico:', error);
                      setChartType(previousChartType);
                    }
                  }
                }}
              >
                <MenuItem value="line">Linha</MenuItem>
                <MenuItem value="doughnut">Rosca</MenuItem>
                <MenuItem value="bar">Barras</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Métrica</InputLabel>
              <Select
                value={selectedMetric}
                label="Métrica"
                onChange={(e) => setSelectedMetric(e.target.value as number)}
                disabled={metrics.length === 0}
              >
                {metrics.map((metric) => (
                  <MenuItem key={metric.id} value={metric.id}>
                    {metric.nome} ({metric.unidade})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {chartType !== 'doughnut' && (
              <FormControl size="small" fullWidth>
                <InputLabel>Intervalo</InputLabel>
                <Select
                  value={timeRange}
                  label="Intervalo"
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                >
                  <MenuItem value="5min">Últimos 5 min</MenuItem>
                  <MenuItem value="15min">Últimos 15 min</MenuItem>
                  <MenuItem value="30min">Últimos 30 min</MenuItem>
                  <MenuItem value="1h">Última 1 hora</MenuItem>
                  <MenuItem value="6h">Últimas 6 horas</MenuItem>
                  <MenuItem value="24h">Últimas 24 horas</MenuItem>
                  <MenuItem value="7d">Últimos 7 dias</MenuItem>
                </Select>
              </FormControl>
            )}

            <Divider sx={{ my: 0.5 }} />

            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                handleRefresh();
                handleSettingsClose();
              }}
              disabled={loading}
              variant="outlined"
              fullWidth
              sx={{ mt: 0.5 }}
            >
              Atualizar Gráfico
            </Button>
          </Box>
        </Popover>

        {/* Gráfico ou estados de loading/erro */}
        <Box sx={{
          flex: 1,
          minHeight: chartType === 'doughnut' ? '170px' : '170px',
          maxHeight: chartType === 'doughnut' ? '170px' : '170px',
          position: 'relative',
        }}>
          {loading && !chartData ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : metrics.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhuma métrica associada a este equipamento
            </Alert>
          ) : !selectedMetric ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Selecione uma métrica para visualizar o gráfico
            </Alert>
          ) : chartData ? (
            <Box sx={{ height: '100%', width: '100%' }}>{renderChart()}</Box>
          ) : null}
        </Box>

        {/* Informações adicionais para gráfico de rosca */}
        {chartType === 'doughnut' && chartData?.metadata && (
          <Box sx={{ mt: 0.75, pt: 0.75, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="body2" sx={{ color: '#00204a', fontWeight: 500 }}>
              Valor atual: <span style={{ color: '#666' }}>{chartData.metadata.currentValue?.toFixed(2)} {chartData.metadata.metrica.unidade}</span>
            </Typography>
            {chartData.metadata.minValue !== undefined && (
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5 }}>
                Valor mínimo: {chartData.metadata.minValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5 }}>
              Valor máximo: {chartData.metadata.maxValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Dialog de Tela Cheia */}
      <Dialog
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            m: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle sx={{ py: 1, px: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {equipamentoNome}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                ID: {equipamentoId}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setFullscreenOpen(false)}>
              <FullscreenExitIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 3, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', overflow: 'auto' }}>
          {/* Controles */}
          <Box sx={{ display: 'flex', gap: 2, mb: 0, flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 1300 }}>
             <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <FormControl size="small" sx={{ minWidth: 120}}>
                              <InputLabel>Tipo de Gráfico</InputLabel>
                              <Select
                                  value={chartType}
                                  label="Tipo de Gráfico"
                  onChange={async (e) => {
                    const newChartType = e.target.value as ChartType;
                    const previousChartType = chartType;
                    setChartType(newChartType);

                    // Atualizar no backend se dashboardItemId estiver disponível
                    if (dashboardItemId && onTipoGraficoChange) {
                      try {
                        const newTipoGraficoId = chartTypeToTipoGraficoId(newChartType);
                        await UsuarioEquipamentoDashboardService.updateTipoGrafico(
                          dashboardItemId,
                          newTipoGraficoId
                        );
                        onTipoGraficoChange();
                      } catch (error) {
                        console.error('Erro ao atualizar tipo de gráfico:', error);
                        // Reverter para o valor anterior em caso de erro
                        setChartType(previousChartType);
                      }
                    }
                  }}
                                  sx={{ borderRadius: 1 }}
                                  MenuProps={{
                                      PaperProps: {
                                          sx: {
                                              borderRadius: 1,
                                              maxHeight: 300,
                                              zIndex: 1400,
                                              '& .MuiMenuItem-root': {
                                                  borderRadius: 1,
                                              },
                                          },
                                      },
                                      anchorOrigin: {
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                      },
                                      transformOrigin: {
                                          vertical: 'top',
                                          horizontal: 'left',
                                      },
                                  }}
                              >
                                  <MenuItem value="line" sx={{ borderRadius: 0 }}>Linha</MenuItem>
                                  <MenuItem value="doughnut" sx={{ borderRadius: 0 }}>Rosca</MenuItem>
                                  <MenuItem value="bar" sx={{ borderRadius: 0 }}>Barras</MenuItem>
                              </Select>
                          </FormControl>

                          <FormControl size="small" sx={{ minWidth: 150}}>
                              <InputLabel>Métrica</InputLabel>
                              <Select
                                  value={selectedMetric}
                                  label="Métrica"
                                  onChange={(e) => setSelectedMetric(e.target.value as number)}
                                  disabled={metrics.length === 0}
                                  sx={{ borderRadius: 1 }}
                                  MenuProps={{
                                      PaperProps: {
                                          sx: {
                                              borderRadius: 1,
                                              maxHeight: 300,
                                              zIndex: 1400,
                                              '& .MuiMenuItem-root': {
                                                  borderRadius: 1,
                                              },
                                          },
                                      },
                                      anchorOrigin: {
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                      },
                                      transformOrigin: {
                                          vertical: 'top',
                                          horizontal: 'left',
                                      },
                                  }}
                              >
                                  {metrics.map((metric) => (
                                      <MenuItem key={metric.id} value={metric.id} sx={{ borderRadius: 0 }}>
                                          {metric.nome} ({metric.unidade})
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>

                          {chartType !== 'doughnut' && (
                              <FormControl size="small" sx={{ minWidth: 120}}>
                                  <InputLabel>Intervalo</InputLabel>
                                  <Select
                                      value={timeRange}
                                      label="Intervalo"
                                      onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                      sx={{ borderRadius: 1 }}
                                      MenuProps={{
                                          PaperProps: {
                                              sx: {
                                                  borderRadius: 1,
                                                  maxHeight: 300,
                                                  '& .MuiMenuItem-root': {
                                                      borderRadius: 1,
                                                  },
                                              },
                                          },
                                          anchorOrigin: {
                                              vertical: 'bottom',
                                              horizontal: 'left',
                                          },
                                          transformOrigin: {
                                              vertical: 'top',
                                              horizontal: 'left',
                                          },
                                      }}
                                  >
                                      <MenuItem value="5min" sx={{ borderRadius: 0 }}>Últimos 5 min</MenuItem>
                                      <MenuItem value="15min" sx={{ borderRadius: 0 }}>Últimos 15 min</MenuItem>
                                      <MenuItem value="30min" sx={{ borderRadius: 0 }}>Últimos 30 min</MenuItem>
                                      <MenuItem value="1h" sx={{ borderRadius: 0 }}>Última 1 hora</MenuItem>
                                      <MenuItem value="6h" sx={{ borderRadius: 0 }}>Últimas 6 horas</MenuItem>
                                      <MenuItem value="24h" sx={{ borderRadius: 0 }}>Últimas 24 horas</MenuItem>
                                      <MenuItem value="7d" sx={{ borderRadius: 0 }}>Últimos 7 dias</MenuItem>
                                  </Select>
                              </FormControl>
                          )}
             </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Atualizar gráfico">
              <IconButton size="small" onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Gráfico em tela cheia */}
          <Box sx={{ flex: 1, minHeight: '500px', position: 'relative' }}>
            {loading && !chartData ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : metrics.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Nenhuma métrica associada a este equipamento
              </Alert>
            ) : !selectedMetric ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selecione uma métrica para visualizar o gráfico
              </Alert>
            ) : chartData ? (
              <Box sx={{ height: '100%', width: '100%' }}>{renderChart()}</Box>
            ) : null}
          </Box>

          {/* Informações adicionais para gráfico de rosca */}
          {chartType === 'doughnut' && chartData?.metadata && (
            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="body2" sx={{ color: '#0A5A6E', fontWeight: 500 }}>
                Valor atual: <span style={{ color: '#666' }}>{chartData.metadata.currentValue?.toFixed(2)} {chartData.metadata.metrica.unidade}</span>
              </Typography>
              {chartData.metadata.minValue !== undefined && (
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5 }}>
                  Valor mínimo: {chartData.metadata.minValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5 }}>
                Valor máximo: {chartData.metadata.maxValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChartCard;

