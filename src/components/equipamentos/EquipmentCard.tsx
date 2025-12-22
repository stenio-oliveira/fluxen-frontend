import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditingEquipamento, setDeletingEquipamento } from "../../redux/slices/equipamentosTableSlice";

interface EquipmentCardProps {
  equipment: {
    id: number;
    nome: string;
    cliente_nome?: string | null;
  };
  isAdmin: boolean;
  canDelete?: boolean; // Indica se pode deletar (admin ou gestor)
}

export default function EquipmentCard({ equipment, isAdmin, canDelete = false }: EquipmentCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditingEquipamento(equipment.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setDeletingEquipamento(equipment.id));
  };

  const handleCardClick = () => {
    navigate(`/equipamentos/${equipment.id}`);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleCardClick}
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
              ID: {equipment.id}
            </Typography>

            {/* Nome do Equipamento */}
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{
                mb: 1,
                fontSize: '1rem',
                wordBreak: 'break-word',
              }}
            >
              {equipment.nome}
            </Typography>

            {/* Cliente */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Cliente
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: equipment.cliente_nome ? "text.primary" : "text.secondary",
                  fontWeight: equipment.cliente_nome ? "500" : "400",
                  fontStyle: equipment.cliente_nome ? "normal" : "italic",
                }}
              >
                {equipment.cliente_nome || "Sem cliente associado"}
              </Typography>
            </Box>
          </Box>

          {/* Ações */}
          {canDelete ? (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'flex-start',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isAdmin && (
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
              )}
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
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              Apenas consulta
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

