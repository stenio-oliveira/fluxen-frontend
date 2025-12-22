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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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
    const fontSize = Math.max(36, minDimension / 6); // Fonte responsiva, mínimo 36px para mais destaque

    // Desenhar valor principal em destaque (maior e mais visível)
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${fontSize}px Arial`;
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
}

const ChartCard: React.FC<ChartCardProps> = ({ equipamentoId, equipamentoNome, initialMetricId }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<number | ''>(initialMetricId || '');
  const [timeRange, setTimeRange] = useState<TimeRange>('5min');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [metrics, setMetrics] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const refreshIntervalRef = useRef<number | null>(null);

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

  const renderChart = () => {
    if (!chartData) return null;

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
      };
    }

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        minHeight: '400px',
        height: '100%',
        boxShadow: 3,
        border: '1px solid lightgray',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Cabeçalho com nome e ID do equipamento */}
        <Box sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {equipamentoNome}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            ID: {equipamentoId}
          </Typography>
        </Box>

        {/* Controles */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tipo de Gráfico</InputLabel>
            <Select
              value={chartType}
              label="Tipo de Gráfico"
              onChange={(e) => setChartType(e.target.value as ChartType)}
              sx={{ borderRadius: 0 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 0,
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      borderRadius: 0,
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Métrica</InputLabel>
            <Select
              value={selectedMetric}
              label="Métrica"
              onChange={(e) => setSelectedMetric(e.target.value as number)}
              disabled={metrics.length === 0}
              sx={{ borderRadius: 0 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 0,
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      borderRadius: 0,
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Intervalo</InputLabel>
              <Select
                value={timeRange}
                label="Intervalo"
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                sx={{ borderRadius: 0 }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 0,
                      maxHeight: 300,
                      zIndex: 1400,
                      '& .MuiMenuItem-root': {
                        borderRadius: 0,
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

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Atualizar gráfico">
            <IconButton size="small" onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Visualizar em tela cheia">
            <IconButton size="small" onClick={() => setFullscreenOpen(true)}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Gráfico ou estados de loading/erro */}
        <Box sx={{ flex: 1, minHeight: '300px', position: 'relative' }}>
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
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="body2" color="text.secondary">
              Valor atual: {chartData.metadata.currentValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
                                  onChange={(e) => setChartType(e.target.value as ChartType)}
                                  sx={{ borderRadius: 0 }}
                                  MenuProps={{
                                      PaperProps: {
                                          sx: {
                                              borderRadius: 0,
                                              maxHeight: 300,
                                              zIndex: 1400,
                                              '& .MuiMenuItem-root': {
                                                  borderRadius: 0,
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
                                  sx={{ borderRadius: 0 }}
                                  MenuProps={{
                                      PaperProps: {
                                          sx: {
                                              borderRadius: 0,
                                              maxHeight: 300,
                                              zIndex: 1400,
                                              '& .MuiMenuItem-root': {
                                                  borderRadius: 0,
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
                                      sx={{ borderRadius: 0 }}
                                      MenuProps={{
                                          PaperProps: {
                                              sx: {
                                                  borderRadius: 0,
                                                  maxHeight: 300,
                                                  '& .MuiMenuItem-root': {
                                                      borderRadius: 0,
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
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="body2" color="text.secondary">
                Valor atual: {chartData.metadata.currentValue?.toFixed(2)} {chartData.metadata.metrica.unidade}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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

