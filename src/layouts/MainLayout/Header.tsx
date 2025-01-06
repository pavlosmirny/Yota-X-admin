// src/layouts/MainLayout/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../hooks/useTheme";

// Импортируйте логотип
import logo from "../../assets/vite.jpg"; // Убедитесь, что путь корректный

interface HeaderProps {
  handleDrawerToggle: () => void;
}

export const Header = ({ handleDrawerToggle }: HeaderProps) => {
  const { mode, toggleTheme } = useCustomTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Toolbar>
        {!isSmUp && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Добавьте Box для логотипа */}
        <Box
          component="img"
          src={logo}
          alt="Yota-X Logo"
          sx={{
            height: 40, // Настройте размер логотипа
            mr: 2, // Отступ справа от логотипа
          }}
        />

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Yota-X Admin Panel
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={handleMenu} color="inherit" sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: "45px" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
