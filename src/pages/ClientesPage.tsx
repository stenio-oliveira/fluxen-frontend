import { Box } from '@mui/material';
import React from 'react';
import ClientesTable from '../tables/ClientesTable';

const ClientesPage: React.FC = () => {



  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "grey.50", 
        p: 4,
        width: "90vw",
      }}
    >
      <ClientesTable />
    </Box>
  );
};

export default ClientesPage;
