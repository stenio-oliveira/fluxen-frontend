import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import UserCard from "./UserCard";

interface UsersCardViewProps {
  users: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function UsersCardView({
  users,
  loading,
  page,
  totalPages,
  onPageChange,
}: UsersCardViewProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          p: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nenhum usuário encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={0}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
          />
        ))}
      </Stack>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            pb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}

