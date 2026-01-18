import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from 'react-redux';
import EquipamentosTable from "../tables/EquipamentosTable";
import StatsContainer from '../components/shared/StatsContainer';
import StatsCard from '../components/shared/StatsCard';
import { Devices } from '@mui/icons-material';
import type { RootState } from "../redux/store";

const EquipamentosPage = () => {
  const { rows } = useSelector((state: RootState) => state.equipamentosTable);
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalEquipamentos = rows.length;
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        bgcolor: "grey.50", 
        p: isMobile ? 2 : 3,
        pt: isMobile ? 6 : 3,
        marginLeft: sideMenuWidth,
        width: `calc(100vw - ${sideMenuWidth})`,
        maxWidth: "100%",
        boxSizing: "border-box",
        transition: 'margin-left 0.3s ease, width 0.3s ease',
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ 
          mb: isMobile ? 2 : 3, 
          mt: isMobile ? 2 : 0,
          fontWeight: 600, 
          color: 'text.primary' 
        }}
      >
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

      <Box sx={{ flex: 1, minHeight: 0, mt: isMobile ? 2 : 3 }}>
        <EquipamentosTable />
      </Box>
    </Box>
  );
};

export default EquipamentosPage;
