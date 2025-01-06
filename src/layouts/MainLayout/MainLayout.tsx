// src/layouts/MainLayout/MainLayout.tsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Header } from "./Header";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
          width: { xs: "100%", sm: `calc(100vw - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            p: { xs: 1, sm: 3 }, // Адаптивный паддинг
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
