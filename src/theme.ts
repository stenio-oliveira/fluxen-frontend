// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // você pode mudar para "dark" se quiser
    primary: {
      main: "#0D47A1", // Azul escuro
      light: "#0d52ba", // pouco mais claro do que 0D47A1
      dark: "#002171",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1976D2", // Azul mais claro para complementar
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2E7D32", // Verde elegante
      contrastText: "#ffffff",
    },
    error: {
      main: "#D32F2F", // Vermelho elegante
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ED6C02", // Laranja alerta
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa", // fundo suave
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#4f5b62",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#0D47A1",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#0D47A1",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#0D47A1",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#1976D2",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#333333",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#555555",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      borderRadius: "8px",
    },
  },
  shape: {
    borderRadius: 12, // cantos arredondados para cards e botões
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 20px",
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "",
          borderRadius: 8,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
