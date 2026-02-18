import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const balanceData = [
  { title: "Opening Balance", amount: "Rs. 50,000", color: "#1B0D3F" },
  { title: "Receivable", amount: "Rs. 25,000", color: "#4CAF50" },
  { title: "Payables", amount: "Rs. 15,000", color: "#E53935" },
];

function BalanceCard({ title, amount, color }) {
  const [visible, setVisible] = useState(false);

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 200,
        p: 0,
        overflow: "hidden",
        display: "flex",
        borderRadius: 0.5,
      }}
    >
      <Box sx={{ width: 9, backgroundColor: color, flexShrink: 0 }} />
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
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              // color: "#1B0D3F",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              fontSize: visible ? "0.85rem" : "1.3rem",
              letterSpacing: visible ? 0 : 2,
            }}
          >
            {visible ? amount : "••••••••••"}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setVisible(!visible)}
          sx={{ color: "#1B0D3F" }}
          aria-label={visible ? "Hide amount" : "Show amount"}
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

export default function BalanceCards() {
  return (
    <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
      {balanceData.map((card) => (
        <BalanceCard
          key={card.title}
          title={card.title}
          amount={card.amount}
          color={card.color}
        />
      ))}
    </Box>
  );
}
