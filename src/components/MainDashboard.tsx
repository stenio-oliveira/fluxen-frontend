import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleIcon from "@mui/icons-material/People";
import InsightsIcon from "@mui/icons-material/Insights";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {sideMenuOpen, sideMenuWidth } = useSelector((state: RootState) => state.sideMenu);
  const items = [
    {
      title: "Equipamentos",
      description: "Gerencie todos os equipamentos cadastrados no sistema.",
      icon: <DevicesIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      route: "/equipamentos",
    },
    {
      title: "Clientes",
      description: "Acesse e gerencie as informações dos clientes.",
      icon: <PeopleIcon sx={{ fontSize: 50, color: "secondary.main" }} />,
      route: "/clientes",
    },
    {
      title: "Métricas",
      description: "Acompanhe métricas e indicadores de desempenho.",
      icon: <InsightsIcon sx={{ fontSize: 50, color: "success.main" }} />,
      route: "/metricas",
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 4 },
        
        height: '100vh',
        marginLeft: sideMenuOpen ? sideMenuWidth : "0",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, textAlign: "center", color: 'primary.main' }}
      >
        Dashboard de Gestão
      </Typography>

      <Grid container spacing={3}>
        {items.map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card
              sx={{
                height: "200px",
                boxShadow: 3,
                transition: "transform 0.3s",
                border: "1px solid lightgray",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                navigate(item.route);
                console.log("Rota:", item.route);
              }}
            >
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                {item.icon}
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
