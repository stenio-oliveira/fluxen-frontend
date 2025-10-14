

import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MetricaService from "../services/metricaService";
import { setFeedback } from "../redux/slices/feedBackSlice";
import { Typography, Box, Dialog, Divider, Stack } from "@mui/material";
import type { Metrica } from "../types/Metrica";
import type { Option } from "../types/Option";
import OptionsField from "./shared/OptionsField";
import { BaseButton } from "./shared/Button";
import type { EquipamentoMetrica } from "../types/EquipamentoMetrica";
import Input from "./shared/Input";
import EditButton from "./shared/EditButton";
import DeleteButton from "./shared/DeleteButton";
import { BaseCancelButton } from "./shared/BaseCancelButton";

const ManageMetrics = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [metrics, setMetrics] = React.useState<Metrica[]>([]);
  const [associatedMetrics, setAssociatedMetrics] = React.useState<Metrica[]>([]);
  const [formData, setFormData] = React.useState<Partial<EquipamentoMetrica>>({
    valor_minimo: 0,
    valor_maximo: 0
  });
  const [metricOptions, setMetricOptions] = React.useState<Option[]>([]);
  const [selectedMetric, setSelectedMetric] = React.useState<Metrica | null>( null);
  const [formDataDialogOpen, setFormDataDialogOpen] = React.useState<boolean>(false);
  const [editingEquipamentoMetrica, setEditingEquipamentoMetrica] = React.useState<EquipamentoMetrica | null>(null); 




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
      setFormData({});
      fetchMetricsCallback();
    };

  React.useEffect(() => {
    
    fetchMetricsCallback();
  }, []);

  const   handleAddMetric = async () => {
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


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" color="primary" fontWeight={"bold"} gutterBottom>
        Métricas Associadas
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {associatedMetrics.map((metric) => (
            <Box
              key={metric.id}
              sx={{
                display: "flex",
                gap: 0.5,
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
                fontSize={"small"}
                sx={{ fontWeight: "500" }}
              >
                {metric.nome} ({metric.unidade})
              </Typography>
              <Divider
                orientation="vertical"
                sx={{ color: "primary" }}
                flexItem
              />
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontSize={"12px"}>
                  Mín {metric.valor_minimo}
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{ color: "primary" }}
                  flexItem
                />
                <Typography variant="body2" fontSize={"12px"}>
                  Máx {metric.valor_maximo}
                </Typography>
              </Stack>
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
                }
                  
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Adicionar Nova Métrica:
        </Typography>

        <OptionsField
          label="Métricas"
          options={metricOptions}
          value={selectedMetric?.id}
          onChange={(id) =>
            setSelectedMetric(metrics.find((m) => m.id === id) || null)
          }
          fullWidth
        />
        <BaseButton
          variant="contained"
          onClick={() => setFormDataDialogOpen(true)}
        >
          + Adicionar
        </BaseButton>
      </Box>

      <Dialog
        open={formDataDialogOpen || editingEquipamentoMetrica !== null}
        onClose={() => setFormDataDialogOpen(false)}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Input
            label="Valor Mínimo"
            type="number"
            value={formData.valor_minimo}
            onChange={(e) =>
              setFormData({ ...formData, valor_minimo: Number(e.target.value) })
            }
          />
          <Input
            label="Valor Máximo"
            type="number"
            value={formData.valor_maximo}
            onChange={(e) =>
              setFormData({ ...formData, valor_maximo: Number(e.target.value) })
            }
          />
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
          }}>Cancelar</BaseCancelButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ManageMetrics;