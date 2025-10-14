import { Box } from '@mui/material';
import React from 'react';

import MetricasTable from '../tables/MetricasTable';

const MetricasPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
 
        <MetricasTable />
 
    </Box>
  );
};

export default MetricasPage;
