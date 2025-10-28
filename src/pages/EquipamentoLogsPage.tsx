import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EquipamentoLogGrupoTable from "../tables/EquipamentoLogGrupoTable";
import OnlineStatusCard from "../components/shared/OnlineStatusCard";
import { useEquipamentoStatus } from "../hooks/useEquipamentoStatus";

const EquipamentoLogsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isOnline, lastUpdate, isRefreshing } = useEquipamentoStatus();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            size="small"
          >
            Voltar
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              Logs do Equipamento #{id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Histórico de métricas e valores convertidos
            </Typography>
          </Box>
        </Box>

        {/* Status Card */}
        <Box sx={{ mb: 3 }}>
          <OnlineStatusCard
            isOnline={isOnline}
            lastUpdate={lastUpdate}
            isRefreshing={isRefreshing}
          />
        </Box>

        {/* Tabela de Logs */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            p: 2,
            boxShadow: "none",
          }}
        >
          <EquipamentoLogGrupoTable />
        </Box>
      </Box>
    </Box>
  );
};

export default EquipamentoLogsPage;