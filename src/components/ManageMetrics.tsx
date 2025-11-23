

import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MetricaService from "../services/metricaService";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { Typography, Box, Dialog, Divider, Stack, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import type { Metrica } from "../types/Metrica";
import type { Option } from "../types/Option";
import OptionsField from "./shared/OptionsField";
import { BaseButton } from "./shared/Button";
import type { EquipamentoMetrica } from "../types/EquipamentoMetrica";
import Input from "./shared/Input";
import EditButton from "./shared/EditButton";
import DeleteButton from "./shared/DeleteButton";
import { BaseCancelButton } from "./shared/BaseCancelButton";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ManageMetricsProps {
  disabled?: boolean;
}

const ManageMetrics: React.FC<ManageMetricsProps> = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const [metrics, setMetrics] = React.useState<Metrica[]>([]);
  const [associatedMetrics, setAssociatedMetrics] = React.useState<Metrica[]>([]);
  const [formData, setFormData] = React.useState<Partial<EquipamentoMetrica>>({
    valor_minimo: 0,
    valor_maximo: 0
  });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [metricOptions, setMetricOptions] = React.useState<Option[]>([]);
  const [selectedMetric, setSelectedMetric] = React.useState<Metrica | null>( null);
  const [formDataDialogOpen, setFormDataDialogOpen] = React.useState<boolean>(false);
  const [editingEquipamentoMetrica, setEditingEquipamentoMetrica] = React.useState<EquipamentoMetrica | null>(null);
  const [payloadDialogOpen, setPayloadDialogOpen] = React.useState<boolean>(false); 




  const fetchMetricsCallback = React.useCallback(async () => {
    try {
      const allMetrics = await MetricaService.getMetricas();
      setMetrics(allMetrics);
      const associatedMetrics = await MetricaService.getMetricaByEquipamentoId(
        Number(id)
      );
      setAssociatedMetrics(associatedMetrics);
      const options = allMetrics.map((metric: Metrica) => ({
        id: metric.id,
        name: metric.nome,
      }));
      setMetricOptions(
        options.filter(
          (option) =>
            !associatedMetrics.some((metric) => metric.id === option.id)
        )
      );
    } catch (error) {
      dispatch(
        setFeedback({
          message: `Error fetching metrics: ${error}`,
          type: "error",
        })
      );
      console.error("Error fetching metrics:", error);
    }
  }, []);

    const resetMetrics = () => {
      setFormData({
        valor_minimo: 0
      });
      setValidationErrors({});
      fetchMetricsCallback();
    };

  const validateFormData = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar valor mínimo
    if (formData.valor_minimo === undefined || formData.valor_minimo === null) {
      errors.valor_minimo = 'Valor mínimo é obrigatório';
    } else if (formData.valor_minimo < 0) {
      errors.valor_minimo = 'Valor mínimo não pode ser negativo';
    }

    // Validar valor máximo
    if (formData.valor_maximo === undefined || formData.valor_maximo === null) {
      errors.valor_maximo = 'Valor máximo é obrigatório';
    } else if (formData.valor_maximo < 0) {
      errors.valor_maximo = 'Valor máximo não pode ser negativo';
    }

    // Validar se valores são diferentes
    if (formData.valor_minimo !== undefined && formData.valor_maximo !== undefined) {
      if (formData.valor_minimo === formData.valor_maximo) {
        errors.valor_maximo = 'Valor máximo deve ser diferente do valor mínimo';
      } else if (formData.valor_minimo > formData.valor_maximo) {
        errors.valor_maximo = 'Valor máximo deve ser maior que o valor mínimo';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormData({ ...formData, valor_minimo: value });

    // Limpar erros relacionados ao valor mínimo
    if (validationErrors.valor_minimo) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.valor_minimo;
        return newErrors;
      });
    }

    // Limpar erro de valor máximo se estava relacionado à comparação
    if (validationErrors.valor_maximo &&
      (validationErrors.valor_maximo.includes('diferente') ||
        validationErrors.valor_maximo.includes('maior'))) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.valor_maximo;
        return newErrors;
      });
    }
  };

  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormData({ ...formData, valor_maximo: value });

    // Limpar erro de validação do valor máximo
    if (validationErrors.valor_maximo) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.valor_maximo;
        return newErrors;
      });
    }
  };

  React.useEffect(() => {
    
    fetchMetricsCallback();
  }, []);

  const   handleAddMetric = async () => {
    // Validar formulário antes de adicionar
    if (!validateFormData()) {
      dispatch(
        setFeedback({
          message: "Por favor, corrija os erros nos valores",
          type: "error",
        })
      );
      return;
    }

    if (selectedMetric) {
      const existingMetric = associatedMetrics.find((metric) => metric.id === selectedMetric.id);
      if (existingMetric) {
        dispatch(
          setFeedback({
            message: "Métrica ja associada ao equipamento",
            type: "warning",
          })
        );
        return;
      }
      // Logic to associate the selected metric (e.g., API call)
      try {
        const metricId = selectedMetric.id;


        const associadetMetric = await MetricaService.associateMetricToEquipamento(
          metricId, 
          Number(id),
          formData
        );        

        setAssociatedMetrics([...associatedMetrics, associadetMetric]);
        setFormDataDialogOpen(false);
        setSelectedMetric(null); // Reset selection
        resetMetrics()
      } catch (error) {
        dispatch(
          setFeedback({
            message: `Erro ao adicionar métrica: ${error}`,
            type: "error",
          })
        );
        console.error("Error associating metric:", error);
      }
    }
  };

  const handleDeleteMetric = async (metricToDelete: Metrica) => {
    try {
      const newAssociatedMetrics =
        await MetricaService.desassociateMetricToEquipamento(
          metricToDelete.id,
          Number(id)
        );
      setAssociatedMetrics(newAssociatedMetrics || []);
      resetMetrics()
    } catch (e: any) {
      dispatch(
        setFeedback({
          message: `Erro ao desassociar métrica: ${e}`,
          type: "error",
        })
      );
      console.error("Error desassociating metric:", e);
    }
  };


    const handleUpdateEquipamentoMetrica = async (
    ) => {
      // Validar formulário antes de atualizar
      if (!validateFormData()) {
        dispatch(
          setFeedback({
            message: "Por favor, corrija os erros nos valores",
            type: "error",
          })
        );
        return;
      }

      try {
          await MetricaService.updateEquipamentoMetrica(
          editingEquipamentoMetrica?.id || 0,
          formData
        );
        
        setEditingEquipamentoMetrica(null);
        resetMetrics();
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: `Erro ao atualizar métrica: ${e}`,
            type: "error",
          })
        );
        console.error("Error updating metric:", e);
      }
    };

  // Função para gerar o payload JSON baseado nas métricas associadas
  const generatePayload = () => {
    const logs = associatedMetrics.map(metric => ({
      id_equipamento: Number(id), // ID do equipamento atual
      id_metrica: metric.id,
      valor: 0, // Valor bruto do sensor (0-4096)
      valor_convertido: null // Valor já convertido para a unidade correta da métrica (opcional)
    }));

    return {
      logs
    };
  };

  // Função para copiar o JSON para a área de transferência
  const copyToClipboard = async () => {
    try {
      const payload = generatePayload();
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      dispatch(
        setFeedback({
          message: "Payload copiado para a área de transferência!",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        setFeedback({
          message: "Erro ao copiar payload",
          type: "error",
        })
      );
    }
  };


  return (
    <Box sx={{ p: isMobile ? 1 : 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: isMobile ? 1.5 : 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 1 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          color="primary"
          fontWeight={"bold"}
          sx={{
            fontSize: isMobile ? "0.95rem" : "1.25rem",
          }}
        >
          Métricas Associadas
        </Typography>
        {associatedMetrics.length > 0 && (
          <Tooltip title="Ver modelo de payload para envio de dados">
            <IconButton
              onClick={() => setPayloadDialogOpen(true)}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white"
                }
              }}
            >
              <CodeIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
        {isMobile ? (
          // Layout mobile: Cards individuais
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {associatedMetrics.map((metric) => (
              <Box
                key={metric.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  padding: 1.5,
                  borderRadius: 2,
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                  bgcolor: "white",
                }}
              >
                {/* Header com nome e ações */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Typography
                    color="primary"
                    variant="subtitle2"
                    sx={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      wordBreak: "break-word",
                      flex: 1,
                    }}
                  >
                    {metric.nome} ({metric.unidade})
                  </Typography>
                  {!disabled && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <EditButton
                        onClick={() => {
                          console.log("metric", metric);
                          setEditingEquipamentoMetrica(
                            metric.equipamento_metrica
                              ? metric.equipamento_metrica
                              : null
                          );
                          setFormData({
                            valor_minimo: metric.equipamento_metrica?.valor_minimo || 0,
                            valor_maximo: metric.equipamento_metrica?.valor_maximo || 0,
                          });
                        }}
                      />
                      <DeleteButton onClick={() => handleDeleteMetric(metric)} />
                    </Box>
                  )}
                </Box>

                {/* Valores Min e Máx */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    pt: 0.5,
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem" }}
                    >
                      Mínimo
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {metric.valor_minimo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.7rem" }}
                    >
                      Máximo
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {metric.valor_maximo}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          // Layout desktop: Chips compactos
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {associatedMetrics.map((metric) => (
              <Box
                key={metric.id}
                sx={{
                  display: "flex",
                  gap: 0.75,
                  alignItems: "center",
                  padding: "4px 8px",
                  borderRadius: "16px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  color="primary"
                  variant="body2"
                  sx={{
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    wordBreak: "break-word",
                  }}
                >
                  {metric.nome} ({metric.unidade})
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{ color: "primary" }}
                  flexItem
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px"
                    }}
                  >
                    Mín {metric.valor_minimo}
                  </Typography>
                  <Divider
                    orientation="vertical"
                    sx={{ color: "primary" }}
                    flexItem
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px"
                    }}
                  >
                    Máx {metric.valor_maximo}
                  </Typography>
                </Stack>
                {!disabled && (
                  <>
                    <DeleteButton onClick={() => handleDeleteMetric(metric)} />
                    <EditButton
                      onClick={() => {
                        console.log("metric", metric);
                        setEditingEquipamentoMetrica(
                          metric.equipamento_metrica
                            ? metric.equipamento_metrica
                            : null
                        );
                        setFormData({
                          valor_minimo: metric.equipamento_metrica?.valor_minimo || 0,
                          valor_maximo: metric.equipamento_metrica?.valor_maximo || 0,
                        });
                      }}
                    />
                  </>
                )}
              </Box>
            ))}
            </Box>
        )}
      </Box>
      <Box
        sx={{
          minHeight: isMobile ? 200 : 300,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant={isMobile ? "body2" : "subtitle1"}
          gutterBottom
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            fontWeight: isMobile ? "500" : "600",
          }}
        >
          Adicionar Nova Métrica:
        </Typography>

        <OptionsField
          label="Métricas"
          options={metricOptions}
          value={selectedMetric?.id}
          onChange={(id) =>
            setSelectedMetric(metrics.find((m) => m.id === id) || null)
          }
          disabled={disabled}
          fullWidth
        />
        {!disabled && (
          <BaseButton
            variant="contained"
            onClick={() => setFormDataDialogOpen(true)}
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            + Adicionar
          </BaseButton>
        )}
      </Box>

      <Dialog
        open={formDataDialogOpen || editingEquipamentoMetrica !== null}
        onClose={() => setFormDataDialogOpen(false)}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
        fullWidth
        maxWidth={isMobile ? "sm" : "md"}
      >
        <Box sx={{ p: isMobile ? 1.5 : 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Input
              label="Valor Mínimo"
              type="number"
              value={formData.valor_minimo || 0}
              onChange={handleMinValueChange}
              required
            />
            {validationErrors.valor_minimo && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors.valor_minimo}
              </span>
            )}
          </Box>
          <Box>
            <Input
              label="Valor Máximo"
              type="number"
              value={formData.valor_maximo || ''}
              onChange={handleMaxValueChange}
              required
            />
            {validationErrors.valor_maximo && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors.valor_maximo}
              </span>
            )}
          </Box>
          <BaseButton onClick={( ) => { 
            if (editingEquipamentoMetrica) {
              handleUpdateEquipamentoMetrica();

            } else {
              handleAddMetric();
            }
          }}>Salvar</BaseButton>
          <BaseCancelButton onClick={() => { 
            setFormDataDialogOpen(false);
            setEditingEquipamentoMetrica(null);
            setValidationErrors({});
          }}>Cancelar</BaseCancelButton>
        </Box>
      </Dialog>

      {/* Dialog para mostrar o payload JSON */}
      <Dialog
        open={payloadDialogOpen}
        onClose={() => setPayloadDialogOpen(false)}
        maxWidth={isMobile ? "sm" : "md"}
        fullWidth
        aria-labelledby="payload-dialog-title"
      >
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: isMobile ? 1.5 : 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? 1 : 0,
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              id="payload-dialog-title"
              color="primary"
              fontWeight="bold"
              sx={{
                fontSize: isMobile ? "0.95rem" : "1.25rem",
              }}
            >
              📡 Modelo de Payload para Envio de Dados
            </Typography>
            <Tooltip title="Copiar JSON">
              <IconButton onClick={copyToClipboard} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: isMobile ? 1.5 : 2,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            Use este modelo JSON para enviar dados do equipamento. Substitua os valores de exemplo pelos valores reais dos sensores.
          </Typography>

          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: isMobile ? 1.5 : 2,
              fontFamily: "monospace",
              fontSize: isMobile ? "10px" : "12px",
              overflow: "auto",
              maxHeight: "400px",
              whiteSpace: "pre-wrap"
            }}
          >
            {JSON.stringify(generatePayload(), null, 2)}
          </Box>

          <Box sx={{ mt: 2, p: 2, backgroundColor: "#e3f2fd", borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
              📋 Explicação dos Campos:
            </Typography>
            <Typography variant="body2" component="div">
              <strong>id_equipamento:</strong> ID do equipamento (já preenchido automaticamente)<br />
              <strong>id_metrica:</strong> ID da métrica específica (já preenchido automaticamente)<br />
              <strong>valor:</strong> Valor bruto do sensor (0-4096) - substitua pelos valores reais<br />
              <strong>valor_convertido:</strong> Valor já convertido para a unidade correta da métrica (opcional) - pode ser null se não aplicável
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <BaseCancelButton onClick={() => setPayloadDialogOpen(false)}>
              Fechar
            </BaseCancelButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ManageMetrics;