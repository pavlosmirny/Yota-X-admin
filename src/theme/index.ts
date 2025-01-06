// src/theme/theme.ts
import { createTheme, ThemeOptions, alpha } from "@mui/material/styles";

// Определяем основную палитру цветов с синим в качестве основного цвета
const palette = {
  primary: {
    main: "#1976d2", // Синий
    light: "#63a4ff",
    dark: "#004ba0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#9c27b0", // Фиолетовый
    light: "#d05ce3",
    dark: "#6a0080",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2e7d32", // Зеленый
    light: "#60ad5e",
    dark: "#005005",
    contrastText: "#ffffff",
  },
  error: {
    main: "#d32f2f", // Красный
    light: "#ff6659",
    dark: "#9a0007",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ed6c02", // Оранжевый
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0288d1", // Голубой
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#ffffff",
  },
};

// Базовые настройки темы
const baseThemeOptions: ThemeOptions = {
  palette: {
    ...palette,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.02857em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 6px -1px rgba(0,0,0,0.08)",
    "0px 3px 6px -2px rgba(0,0,0,0.08), 0px 6px 12px -2px rgba(0,0,0,0.12)",
    "0px 4px 8px -2px rgba(0,0,0,0.1), 0px 8px 16px -2px rgba(0,0,0,0.14)",
    "0px 5px 10px -3px rgba(0,0,0,0.12), 0px 10px 20px -3px rgba(0,0,0,0.16)",
    "0px 6px 12px -4px rgba(0,0,0,0.14), 0px 12px 24px -4px rgba(0,0,0,0.18)",
    "0px 7px 14px -5px rgba(0,0,0,0.16), 0px 14px 28px -5px rgba(0,0,0,0.2)",
    "0px 8px 16px -6px rgba(0,0,0,0.18), 0px 16px 32px -6px rgba(0,0,0,0.22)",
    "0px 9px 18px -7px rgba(0,0,0,0.2), 0px 18px 36px -7px rgba(0,0,0,0.24)",
    "0px 10px 20px -8px rgba(0,0,0,0.22), 0px 20px 40px -8px rgba(0,0,0,0.26)",
    "0px 11px 22px -9px rgba(0,0,0,0.24), 0px 22px 44px -9px rgba(0,0,0,0.28)",
    "0px 12px 24px -10px rgba(0,0,0,0.26), 0px 24px 48px -10px rgba(0,0,0,0.3)",
    "0px 13px 26px -11px rgba(0,0,0,0.28), 0px 26px 52px -11px rgba(0,0,0,0.32)",
    "0px 14px 28px -12px rgba(0,0,0,0.3), 0px 28px 56px -12px rgba(0,0,0,0.34)",
    "0px 15px 30px -13px rgba(0,0,0,0.32), 0px 30px 60px -13px rgba(0,0,0,0.36)",
    "0px 16px 32px -14px rgba(0,0,0,0.34), 0px 32px 64px -14px rgba(0,0,0,0.38)",
    "0px 17px 34px -15px rgba(0,0,0,0.36), 0px 34px 68px -15px rgba(0,0,0,0.4)",
    "0px 18px 36px -16px rgba(0,0,0,0.38), 0px 36px 72px -16px rgba(0,0,0,0.42)",
    "0px 19px 38px -17px rgba(0,0,0,0.4), 0px 38px 76px -17px rgba(0,0,0,0.44)",
    "0px 20px 40px -18px rgba(0,0,0,0.42), 0px 40px 80px -18px rgba(0,0,0,0.46)",
    "0px 21px 42px -19px rgba(0,0,0,0.44), 0px 42px 84px -19px rgba(0,0,0,0.48)",
    "0px 22px 44px -20px rgba(0,0,0,0.46), 0px 44px 88px -20px rgba(0,0,0,0.5)",
    "0px 23px 46px -21px rgba(0,0,0,0.48), 0px 46px 92px -21px rgba(0,0,0,0.52)",
    "0px 24px 48px -22px rgba(0,0,0,0.5), 0px 48px 96px -22px rgba(0,0,0,0.54)",
    "0px 25px 50px -23px rgba(0,0,0,0.56)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: palette.primary.dark,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 12,
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "24px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.12),
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        track: {
          borderRadius: 22 / 2,
          opacity: 0.3,
        },
        thumb: {
          boxShadow: "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
};

// Светлая тема
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: "light",
    background: {
      default: "#f0f4f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
});

// Темная тема
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b0b0b0",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    ...baseThemeOptions.components,
    MuiPaper: {
      ...baseThemeOptions.components?.MuiPaper,
      styleOverrides: {
        ...baseThemeOptions.components?.MuiPaper?.styleOverrides,
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
});
