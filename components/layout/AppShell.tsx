"use client";

import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#EEEDF2",
      }}
    >
      <Navbar />
      <HeroSection />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
