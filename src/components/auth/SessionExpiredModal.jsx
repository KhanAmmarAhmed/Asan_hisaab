import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      setOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginRedirect = () => {
    setOpen(false);
    logout(); 
  };

  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
        Session Expired
      </DialogTitle>
      <DialogContent>
        <Typography>
          Your session has expired. To continue using the application, please log back in.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleLoginRedirect}
          variant="contained"
          sx={{
            backgroundColor: "#1B0D3F",
            "&:hover": { backgroundColor: "#2D1B69" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
