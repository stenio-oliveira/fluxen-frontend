import { Box } from "@mui/material";
import EquipamentosTable from "../tables/EquipamentosTable";

const EquipamentosPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
      <EquipamentosTable />
    </Box>
  );
};

export default EquipamentosPage;
