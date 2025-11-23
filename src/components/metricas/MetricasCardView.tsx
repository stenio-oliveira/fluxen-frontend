import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import MetricaCard from "./MetricaCard";

interface MetricasCardViewProps {
  metricas: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MetricasCardView({
  metricas,
  loading,
  page,
  totalPages,
  onPageChange,
}: MetricasCardViewProps) {
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

  if (metricas.length === 0) {
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
          Nenhuma métrica encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={0}>
        {metricas.map((metrica) => (
          <MetricaCard
            key={metrica.id}
            metrica={metrica}
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

