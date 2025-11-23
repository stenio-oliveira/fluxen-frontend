import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import EquipmentCard from "./EquipmentCard";

interface EquipmentsCardViewProps {
  equipments: any[];
  loading: boolean;
  isAdmin: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EquipmentsCardView({
  equipments,
  loading,
  isAdmin,
  page,
  totalPages,
  onPageChange,
}: EquipmentsCardViewProps) {
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

  if (equipments.length === 0) {
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
          Nenhum equipamento encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={0}>
        {equipments.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            isAdmin={isAdmin}
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

