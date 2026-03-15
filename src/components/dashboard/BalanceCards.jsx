

import React, { useState } from "react";
import { Card, Box, Typography, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function BalanceCard({ title, amount }) {
  const [visible, setVisible] = useState(false);

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 200,
        display: "flex",
        borderRadius: 0.5,
        overflow: "hidden",
      }}
    >
      {/* Left Color Bar */}
      <Box
        sx={{
          width: 9,
          backgroundColor:
            title === "Opening Balance"
              ? "#1B0D3F"
              : title === "Receivable"
                ? "#4CAF50"
                : title === "Paid Amount"
                  ? "#4CAF50"
                  : title === "Payables"
                    ? "red"
                    : title === "Pending Amount"
                      ? "red"
                      : "#1B0D3F",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          px: 2.5,
          py: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#888",
              fontSize: visible ? "0.9rem" : "1.3rem",
              letterSpacing: visible ? 0 : 2,
            }}
          >
            {visible ? amount : "••••••••••"}
          </Typography>
        </Box>

        <IconButton
          onClick={() => setVisible(!visible)}
          sx={{ color: "#1B0D3F" }}
        >
          {visible ? (
            <VisibilityIcon fontSize="small" />
          ) : (
            <VisibilityOffIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Card>
  );
}
