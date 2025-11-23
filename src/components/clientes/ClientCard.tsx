import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setEditingCliente, setDeletingCliente } from "../../redux/slices/clientesTableSlice";

interface ClientCardProps {
  client: {
    id: number;
    nome: string;
    cnpj?: string | null;
    responsavel_nome?: string | null;
  };
}

export default function ClientCard({ client }: ClientCardProps) {
  const dispatch = useDispatch();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditingCliente(client.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setDeletingCliente(client.id));
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
              ID: {client.id}
            </Typography>

            {/* Nome do Cliente */}
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
              {client.nome}
            </Typography>

            {/* CNPJ */}
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                CNPJ
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: client.cnpj ? "text.primary" : "text.secondary",
                  fontWeight: client.cnpj ? "500" : "400",
                  fontStyle: client.cnpj ? "normal" : "italic",
                }}
              >
                {client.cnpj || "Não informado"}
              </Typography>
            </Box>

            {/* Responsável */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Responsável
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: client.responsavel_nome ? "text.primary" : "text.secondary",
                  fontWeight: client.responsavel_nome ? "500" : "400",
                  fontStyle: client.responsavel_nome ? "normal" : "italic",
                }}
              >
                {client.responsavel_nome || "Não informado"}
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

