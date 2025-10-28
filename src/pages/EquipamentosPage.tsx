import { Box, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import EquipamentosTable from "../tables/EquipamentosTable";
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { Devices, CheckCircle, Warning, Speed } from '@mui/icons-material';
import type { RootState } from "../redux/store";

const EquipamentosPage = () => {
  const { rows } = useSelector((state: RootState) => state.equipamentosTable);

  const totalEquipamentos = rows.length;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "grey.50", p: 3, width: "90vw" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
        Equipamentos
      </Typography>

      <StatsContainer title="Estatísticas">
        <StatsCard
          title="Total de Equipamentos"
          value={totalEquipamentos}
          icon={<Devices />}
          color="primary"
        />
      </StatsContainer>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <EquipamentosTable />
      </Box>
    </Box>
  );
};

export default EquipamentosPage;
