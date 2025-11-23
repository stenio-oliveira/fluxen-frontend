import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setEditingMetrica, setDeletingMetrica } from "../../redux/slices/metricasTableSlice";

interface MetricaCardProps {
  metrica: {
    id: number;
    nome: string;
    unidade?: string | null;
  };
}

export default function MetricaCard({ metrica }: MetricaCardProps) {
  const dispatch = useDispatch();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditingMetrica(metrica.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setDeletingMetrica(metrica.id));
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          {/* Informações principais */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* ID */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 0.5 }}
            >
              ID: {metrica.id}
            </Typography>

            {/* Nome da Métrica */}
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{
                mb: 1.5,
                fontSize: '1rem',
                wordBreak: 'break-word',
              }}
            >
              {metrica.nome}
            </Typography>

            {/* Unidade */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Unidade
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: metrica.unidade ? "text.primary" : "text.secondary",
                  fontWeight: metrica.unidade ? "500" : "400",
                  fontStyle: metrica.unidade ? "normal" : "italic",
                }}
              >
                {metrica.unidade || "Não informado"}
              </Typography>
            </Box>
          </Box>

          {/* Ações */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              alignItems: 'flex-start',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              color="primary"
              onClick={handleEdit}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              sx={{
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'white',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

