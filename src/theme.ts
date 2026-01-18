// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a237e", // Azul escuro estilo Sirros
      light: "#42a5f5", // Azul claro para destaques e hovers
      dark: "#0d47a1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#42a5f5", // Azul claro complementar
      light: "#90caf9",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2e7d32", // Verde
      light: "#66bb6a",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f", // Vermelho
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ed6c02", // Laranja
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    info: {
      main: "#42a5f5", // Azul claro
      light: "#90caf9",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa", // Fundo suave
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#1a237e",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#1a237e",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1a237e",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#1a237e",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1a237e",
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#42a5f5",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#1a1a1a",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#6b7280",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      borderRadius: "8px",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 24px",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(26, 35, 126, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          "&:hover": {
            boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#42a5f5",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1a237e",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
