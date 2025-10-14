import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import EquipamentosTable from "../tables/EquipamentosTable";

const EquipamentosPage = () => {
  const { sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  console.log("sideMenuWidth", sideMenuWidth);
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: { 
          xs: '100vw',
          sm: "80vw"
        }
      }}
    >
      {/* Conteúdo principal, deslocado pela largura da sidebar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sideMenuWidth}px`, // deixa espaço para o menu lateral
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header da página */}
        <Typography variant="h5" color="primary" fontWeight="bold">
          Equipamentos
        </Typography>

        {/* Tabela principal */}
        <Paper elevation={1} sx={{ flex: 1, p: 2, height: 500 }}>
          <EquipamentosTable />
        </Paper>
      </Box>
    </Box>
  );
};

export default EquipamentosPage;
