import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function MaintenancePage({ title, description }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
      }}
    >
      <Card sx={{ maxWidth: 480, width: "100%", borderRadius: 3 }}>
        <CardContent sx={{ textAlign: "center", py: 6, px: 4 }}>
          <ConstructionIcon
            sx={{ fontSize: 56, color: "#1B0D3F", mb: 2, opacity: 0.6 }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#1B0D3F", mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#888", lineHeight: 1.6 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
