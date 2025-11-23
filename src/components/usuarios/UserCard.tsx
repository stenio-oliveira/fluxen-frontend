import { Card, CardContent, Typography, Box, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setEditingUser, setDeletingUser } from "../../redux/slices/usersTableSlice";

interface UserCardProps {
  user: {
    id: number;
    nome: string;
    email?: string | null;
    username?: string | null;
    perfil_nome?: string | null;
  };
}

export default function UserCard({ user }: UserCardProps) {
  const dispatch = useDispatch();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setEditingUser(user.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setDeletingUser(user.id));
  };

  const isAdmin = user.perfil_nome === 'ADM';

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
            {/* ID e Perfil */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                ID: {user.id}
              </Typography>
              {isAdmin && (
                <Chip
                  label="ADM"
                  size="small"
                  color="warning"
                  sx={{ height: 20, fontSize: '0.65rem' }}
                />
              )}
            </Box>

            {/* Nome do Usuário */}
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
              {user.nome}
            </Typography>

            {/* Email */}
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Email
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: user.email ? "text.primary" : "text.secondary",
                  fontWeight: user.email ? "500" : "400",
                  fontStyle: user.email ? "normal" : "italic",
                  wordBreak: 'break-word',
                }}
              >
                {user.email || "Não informado"}
              </Typography>
            </Box>

            {/* Username */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Usuário
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: user.username ? "text.primary" : "text.secondary",
                  fontWeight: user.username ? "500" : "400",
                  fontStyle: user.username ? "normal" : "italic",
                }}
              >
                {user.username || "Não informado"}
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

