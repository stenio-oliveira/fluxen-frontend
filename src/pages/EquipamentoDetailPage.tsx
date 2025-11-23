import {
  Box,
  Button,
  Card,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import EquipamentoForm from "../components/EquipamentoForm";
import EquipamentoCliente from "../components/EquipamentoCliente";
import { useNavigate, useParams } from "react-router-dom";
import ManageMetrics from "../components/ManageMetrics";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { setFeedback } from "../redux/slices/feedBackSlice";
import EquipamentoService from "../services/equipamentoService";
import type { Equipamento } from "../types/Equipamento";
import { useState, useEffect } from "react";

const EquipamentoDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.user);
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // Verificar se o usuário é ADM
  const isAdmin = user?.perfil_nome === 'ADM';

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

  // Função para copiar API key
  const copyApiKey = async () => {
    if (equipamento?.api_key) {
      try {
        await navigator.clipboard.writeText(equipamento.api_key);
        dispatch(setFeedback({
          message: 'API Key copiada para a área de transferência!',
          type: 'success'
        }));
      } catch (error) {
        dispatch(setFeedback({
          message: 'Erro ao copiar API Key',
          type: 'error'
        }));
      }
    }
  };
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
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            mb: isMobile ? 2 : 3,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
            mt: isMobile ? 1 : 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 1 : 2,
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "100%" : "auto",
            }}
          >
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
            <Box sx={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                color="primary"
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                Detalhes do Equipamento
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
              >
                Gerencie informações, métricas e cliente
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => navigate(`/equipamentos/${id}/logs`)}
            variant="contained"
            startIcon={<HistoryIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              alignSelf: isMobile ? "flex-start" : "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Ver Logs
          </Button>
        </Box>

        {/* API Key - Apenas para Admin */}
        {isAdmin && equipamento?.api_key && (
          <Card
            elevation={1}
            sx={{
              mb: isMobile ? 2 : 3,
              padding: isMobile ? 1.5 : 2,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1.5 : 2,
              boxShadow: "none",
              border: "1px solid lightgray",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: 1,
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.95rem" : "1.25rem",
                }}
              >
                🔑 API Key
              </Typography>
              <Tooltip title={showApiKey ? "Ocultar API Key" : "Mostrar API Key"}>
                <IconButton
                  onClick={() => setShowApiKey(!showApiKey)}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                >
                  {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Collapse in={showApiKey}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  value={equipamento.api_key}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copiar API Key">
                          <IconButton onClick={copyApiKey} color="primary" size={isMobile ? "small" : "medium"}>
                            <ContentCopyIcon fontSize={isMobile ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: {
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                      }
                    }
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.75rem"
                  }}
                >
                  Use esta chave para autenticar o envio de dados do equipamento.
                </Typography>
              </Box>
            </Collapse>

            {!showApiKey && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <Chip
                  icon={<KeyIcon />}
                  label="API Key disponível"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  color="primary"
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.75rem",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: isMobile ? "0.65rem" : "0.75rem"
                  }}
                >
                  Clique no ícone de olho para visualizar
                </Typography>
              </Box>
            )}
          </Card>
        )}

        {/* Informações do Equipamento */}
        <Card
          elevation={1}
          sx={{
            mb: isMobile ? 2 : 3,
            padding: isMobile ? 1.5 : 2,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 1.5 : 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 1,
              fontSize: isMobile ? "0.95rem" : "1.25rem",
            }}
          >
            📝 Informações do Equipamento
          </Typography>
          <EquipamentoForm disabled={!isAdmin} />
        </Card>

        {/* Cliente Associado */}
        <Card
          elevation={1}
          sx={{
            mb: isMobile ? 2 : 3,
            padding: isMobile ? 1.5 : 2,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 1.5 : 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 1,
              fontSize: isMobile ? "0.95rem" : "1.25rem",
            }}
          >
            👤 Cliente Associado
          </Typography>
          <EquipamentoCliente disabled={!isAdmin} />
        </Card>

        {/* Métricas Associadas */}
        <Card
          elevation={1}
          sx={{
            padding: isMobile ? 1.5 : 2,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 1.5 : 2,
            boxShadow: "none",
            border: "1px solid lightgray",
            borderRadius: 2,
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 1,
              fontSize: isMobile ? "0.95rem" : "1.25rem",
            }}
          >
            📊 Métricas Associadas
          </Typography>
          <ManageMetrics disabled={!isAdmin} />
        </Card>
      </Box>
    </Box>
  );
};

export default EquipamentoDetail;
