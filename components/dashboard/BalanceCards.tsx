

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export interface BalanceCardProps {
  title: string;
  amount: string;
  color: string;
}

export default function BalanceCards({
  title,
  amount,
  color,
}: BalanceCardProps) {
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
      <Box
        sx={{
          width: 10,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
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
              color: "#1B0D3F",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#888",
              fontSize: "0.85rem",
              letterSpacing: visible ? 0 : 2,
            }}
          >
            {visible ? amount : "•••••••"}
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
