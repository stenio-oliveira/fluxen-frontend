import {
  Box,
  Button,
  Card,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import EquipamentoForm from "../components/EquipamentoForm";
import EquipamentoCliente from "../components/EquipamentoCliente";
import { useNavigate, useParams } from "react-router-dom";
import ManageMetrics from "../components/ManageMetrics";

const EquipamentoDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  
  
  
  // MOCK DATA
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              size="small"
            >
              Voltar
            </Button>
            <Box>
              <Typography variant="h5" color="primary" fontWeight="bold">
                Detalhes do Equipamento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gerencie informações, métricas e cliente
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => navigate(`/equipamentos/${id}/logs`)}
            variant="contained"
            startIcon={<HistoryIcon />}
            size="small"
          >
            Ver Logs
          </Button>
        </Box>

        {/* Informações do Equipamento */}
        <Card
          elevation={1}
          sx={{
            mb: 3,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            📝 Informações do Equipamento
          </Typography>
          <EquipamentoForm />
        </Card>

        {/* Cliente Associado */}
        <Card
          elevation={1}
          sx={{
            mb: 3,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            👤 Cliente Associado
          </Typography>
          <EquipamentoCliente />
        </Card>

        {/* Métricas Associadas */}
        <Card
          elevation={1}
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
            📊 Métricas Associadas
          </Typography>
          <ManageMetrics />
        </Card>
      </Box>
    </Box>
  );
};

export default EquipamentoDetail;
