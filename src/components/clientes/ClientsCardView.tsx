import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import ClientCard from "./ClientCard";

interface ClientsCardViewProps {
  clients: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ClientsCardView({
  clients,
  loading,
  page,
  totalPages,
  onPageChange,
}: ClientsCardViewProps) {
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

  if (clients.length === 0) {
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
          Nenhum cliente encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={0}>
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
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

