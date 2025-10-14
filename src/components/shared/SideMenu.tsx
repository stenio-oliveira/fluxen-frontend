import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListIcon from "@mui/icons-material/List";
import { IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService"; 
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export default function SideMenu() {
  const user = useSelector((state: RootState) => state.user.user);
  const [open, setOpen] = React.useState(false);
  const sideMenuRef = React.useRef<HTMLDivElement>(null);

  const links = [
    {
      name: "Equipamentos",
      link: "/equipamentos",
      icon: <HomeRepairServiceIcon color="primary" />,
    },
    {
      name: "Clientes",
      link: "/clientes",
      icon: <AccountCircle color="primary" />,
    },
    {
      name: "Métricas",
      link: "/metricas",
      icon: <AnalyticsIcon color="primary" />,
    },
  ];
  
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  React.useEffect(()=> { 
    if (sideMenuRef.current) {
      sideMenuRef.current.style.width = open ? "250px" : "0";
    }
  }, []);

  const DrawerList = (
    <Box ref={sideMenuRef} sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {links.map((link) => (
          <ListItem key={link.link} disablePadding>
            <ListItemButton onClick={( ) => window.location.assign(link.link)}>
              <ListItemIcon color="primary">
                  {link.icon}
              </ListItemIcon>

              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <IconButton
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": { backgroundColor: "primary.light" },
          boxShadow: 1
        }}
        size="small"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <ListIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
