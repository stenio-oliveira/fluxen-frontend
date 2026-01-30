import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toggleSideMenu } from "../../redux/slices/sideMenuSlice";

export default function SideMenu() {
  const user = useSelector((state: RootState) => state.user.user);
  const { sideMenuOpen } = useSelector((state: RootState) => state.sideMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se o usuário é ADM ou gestor
  const isAdmin = user?.perfil_nome === 'ADM';
  const isGestor = user?.is_gestor === true;

  const allLinks = [
    {
      name: "Dashboard",
      link: "/",
      icon: <DashboardIcon />,
    },
    {
      name: "Equipamentos",
      link: "/equipamentos",
      icon: <HomeRepairServiceIcon />,
    },
    {
      name: "Clientes",
      link: "/clientes",
      icon: <AccountCircle />,
      adminOrManager: true, // Disponível para ADM e gestores
    },
    {
      name: "Usuários",
      link: "/usuarios",
      icon: <PeopleIcon />,
      adminOnly: true, // Apenas para ADM
    },
    {
      name: "Métricas",
      link: "/metricas",
      icon: <AnalyticsIcon />,
      adminOnly: true, // Apenas para ADM
    },
  ];

  // Filtrar links baseado no perfil do usuário
  const links = allLinks.filter(link => {
    if (link.adminOnly) {
      return isAdmin;
    }
    if (link.adminOrManager) {
      return isAdmin || isGestor;
    }
    return true; // Links sem restrição (Dashboard, Equipamentos)
  });

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/auth';
  };

  const handleNavigate = (link: string) => {
    navigate(link);
  };

  const handleToggleMenu = () => {
    dispatch(toggleSideMenu());
  };

  // Se não houver usuário, não mostrar sidebar
  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: sideMenuOpen ? "220px" : "64px",
        background: "#00204a",
        color: "#ffffff",
        transition: "width 0.3s ease",
        overflow: "hidden",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo/Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          minHeight: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: sideMenuOpen ? "space-between" : "center",
          gap: 1,
        }}
      >
        {sideMenuOpen && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.5px",
              flex: 1,
              textAlign: "center",
            }}
          >
            FLUXEN
          </Typography>
        )}
        <Tooltip title={sideMenuOpen ? "Recolher menu" : "Expandir menu"}>
          <IconButton
            onClick={handleToggleMenu}
            sx={{
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              minWidth: 40,
              width: 40,
              height: 40,
            }}
          >
            {sideMenuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Informações do usuário */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: sideMenuOpen ? "flex-start" : "center",
          gap: 1.5 
        }}>
          <Avatar
            sx={{
              bgcolor: "#42a5f5",
              width: 40,
              height: 40,
              flexShrink: 0,
            }}
          >
            {user.nome.charAt(0).toUpperCase()}
          </Avatar>
          {sideMenuOpen && (
            <Box 
              sx={{ 
                flex: 1, 
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "#ffffff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.nome}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Menu Links */}
      <List sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {links.map((link) => {
          const isActive = location.pathname === link.link;
          return (
            <ListItem key={link.link} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!sideMenuOpen ? link.name : ""} placement="right">
                <ListItemButton
                  onClick={() => handleNavigate(link.link)}
                  sx={{
                    mx: 1,
                    borderRadius: "8px",
                    backgroundColor: isActive ? "#1FB6D5" : "transparent",
                    color: "#ffffff",
                    justifyContent: sideMenuOpen ? "flex-start" : "center",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "#1FB6D5"
                        : "rgba(31, 182, 213, 0.15)",
                      color: "#ffffff",
                      boxShadow: isActive ? "0 0 8px rgba(31, 182, 213, 0.4)" : "none",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#ffffff" : "#ffffff",
                      minWidth: sideMenuOpen ? 40 : 0,
                      justifyContent: "center",
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  {sideMenuOpen && (
                    <ListItemText
                      primary={link.name}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.95rem",
                        color: "#ffffff",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Botão de Logout */}
      <List sx={{ py: 1 }}>
        <ListItem disablePadding>
          <Tooltip title={!sideMenuOpen ? "Sair" : ""} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                borderRadius: "8px",
                color: "#ffffff",
                justifyContent: sideMenuOpen ? "flex-start" : "center",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.2)",
                  color: "#ffffff",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#ffffff",
                  minWidth: sideMenuOpen ? 40 : 0,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {sideMenuOpen && (
                <ListItemText
                  primary="Sair"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#ffffff",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
}
