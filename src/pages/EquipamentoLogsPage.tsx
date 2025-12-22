import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EquipamentoLogGrupoTable from "../tables/EquipamentoLogGrupoTable";
import OnlineStatusCard from "../components/shared/OnlineStatusCard";
import { useEquipamentoStatus } from "../hooks/useEquipamentoStatus";
import { useState, useEffect } from "react";
import EquipamentoService from "../services/equipamentoService";
import type { Equipamento } from "../types/Equipamento";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";

const EquipamentoLogsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isOnline, lastUpdate, isRefreshing } = useEquipamentoStatus();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);

  // Buscar dados do equipamento
  useEffect(() => {
    const fetchEquipamento = async () => {
      if (id) {
        try {
          const equipamentoData = await EquipamentoService.getEquipamentoById(Number(id));
          setEquipamento(equipamentoData);
        } catch (error) {
          console.error('Erro ao buscar equipamento:', error);
          dispatch(setFeedback({
            message: 'Erro ao carregar dados do equipamento',
            type: 'error'
          }));
        }
      }
    };

    fetchEquipamento();
  }, [id, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        p: isMobile ? 2 : 4,
        pt: isMobile ? 6 : 4, // Padding-top maior no mobile para evitar sobreposição do botão de navegação
        width: isMobile ? "100vw" : "90vw",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 1 : 2,
            mb: isMobile ? 2 : 3,
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            mt: isMobile ? 1 : 0, // Margem superior adicional no mobile
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="primary"
              fontWeight="bold"
              sx={{ mb: 0.5 }}
            >
              {equipamento ? equipamento.nome : `Logs do Equipamento #${id}`}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Histórico de métricas e valores convertidos
            </Typography>
            {equipamento && (
              <Typography
                variant={isMobile ? "body2" : "body1"}
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Cliente: {equipamento.cliente_nome || equipamento.cliente?.nome || 'Não informado'}
              </Typography>
            )}
          </Box>
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              alignSelf: isMobile ? "flex-start" : "center",
            }}
          >
            Voltar
          </Button>
        </Box>

        {/* Status Card */}
        <Box sx={{ mb: isMobile ? 2 : 3 }}>
          <OnlineStatusCard
            isOnline={isOnline}
            lastUpdate={lastUpdate}
            isRefreshing={isRefreshing}
          />
        </Box>

        {/* Tabela/Cards de Logs */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: isMobile ? 1 : 2,
            border: "1px solid #e0e0e0",
            p: isMobile ? 1 : 2,
            boxShadow: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <EquipamentoLogGrupoTable />
        </Box>
      </Box>
    </Box>
  );
};

export default EquipamentoLogsPage;