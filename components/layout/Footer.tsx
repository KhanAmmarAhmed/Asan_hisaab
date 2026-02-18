"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1B0D3F",
        px: { xs: 2, md: 4 },
        py: 2.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        mt: "auto",
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}
      >
        &copy; 2020. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "#FFFFFF", fontSize: "0.85rem", fontWeight: 500 }}
        >
          Terms & Conditions
        </Link>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "#FFFFFF", fontSize: "0.85rem", fontWeight: 500 }}
        >
          Privacy Policy
        </Link>
      </Box>
    </Box>
  );
}
