import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EquipamentoForm from "../components/EquipamentoForm";
import EquipamentoCliente from "../components/EquipamentoCliente";
import { useNavigate } from "react-router-dom";
import ManageMetrics from "../components/ManageMetrics";

const EquipamentoDetail = () => {

  const navigate= useNavigate();

  
  
  
  // MOCK DATA
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
          <Box>
            <Typography variant="h4" color="primary" fontWeight="bold">
              Detalhes do Equipamento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie as informações, métricas e cliente do equipamento
            </Typography>
          </Box>
        </Box>

        {/* Informações do Equipamento */}
        <Card
          elevation={1}
          sx={{
            mb: 4,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            overflow: 'auto',
           
          }}
        >
          <Typography sx={{ color: "primary.main", fontWeight: "bold" }}>
            📝 Informações do Equipamento
          </Typography>
          <EquipamentoForm />
        </Card>

        {/* Cliente Associado */}
        <Card
          elevation={1}
          sx={{
            mb: 4,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "none",
            border: "1px solid lightgray",
          }}
        >
          {" "}
          <Typography sx={{ color: "primary.main", fontWeight: "bold" }}>
            👤 Cliente Associado
          </Typography>
          <EquipamentoCliente />
        </Card>

        {/* Métricas Associadas */}
        <Card
          sx={{
            padding: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "auto",
          }}
        >
          <ManageMetrics />
        </Card>
      </Box>
    </Box>
  );
};

export default EquipamentoDetail;
