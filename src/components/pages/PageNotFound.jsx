import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PURPLE = "#2E266D";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        // minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* 404 Big Text */}
      <Typography
        variant="h1"
        fontWeight={700}
        sx={{
          color: PURPLE,
          fontSize: { xs: "80px", sm: "120px" },
        }}
      >
        404
      </Typography>

      {/* Message */}
      <Typography variant="h5" fontWeight={600} mb={1}>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </Typography>

      {/* Back Button */}
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: PURPLE,
          px: 4,
          py: 1,
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#241F57",
          },
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}
