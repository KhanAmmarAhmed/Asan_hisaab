import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "@/context/AuthContext";

const SwitchAccount = () => {
  const navigate = useNavigate();
  const { accounts, currentAccount, switchAccount, removeAccount } = useAuth();

  // If there are no accounts, show a message and link to login
  if (accounts.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#EEEDF2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          p: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            boxShadow: "0 4px 20px rgba(27, 13, 63, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#1B0D3F",
              fontWeight: 700,
              mb: 2,
              textAlign: "center",
            }}
          >
            No Accounts Available
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            No accounts have been added yet. Please log in to create an account.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" },
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
            }}
          >
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  const handleSwitch = (accountId) => {
    const success = switchAccount(accountId);
    if (success) {
      // Navigate to dashboard after switching account
      navigate("/dashboard");
    }
  };

  const handleRemove = (e, accountId) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to remove this account? This action cannot be undone.",
      )
    ) {
      removeAccount(accountId);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#EEEDF2",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography
          variant="h5"
          sx={{ color: "#1B0D3F", fontWeight: 700, mb: 1 }}
        >
          Account Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select an account below to switch to. Your current session will be
          updated accordingly.
        </Typography>

        <Card
          sx={{
            boxShadow: "0 4px 20px rgba(27, 13, 63, 0.1)",
            overflow: "hidden",
          }}
        >
          <List>
            {accounts.map((account, index) => (
              <React.Fragment key={account.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {currentAccount?.id === account.id && (
                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                      )}
                      <IconButton
                        edge="end"
                        aria-label={`Remove ${account.name || "account"}`}
                        onClick={(e) => handleRemove(e, account.id)}
                        sx={{
                          color: "#f44336",
                          "&:hover": { backgroundColor: "#ffebee" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton
                    onClick={() => handleSwitch(account.id)}
                    sx={{
                      py: 2,
                      px: 3,
                      "&:hover": { backgroundColor: "#F5F5F5" },
                      backgroundColor:
                        currentAccount?.id === account.id
                          ? "#e8f5e9"
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "#1B0D3F",
                          width: 48,
                          height: 48,
                        }}
                      >
                        {account.name
                          ? account.name.charAt(0).toUpperCase()
                          : "A"}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: "#1B0D3F" }}
                        >
                          {account.name || "Unknown Account"}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {account.email}
                          {account.client_id && ` • ID: ${account.client_id}`}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < accounts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => navigate("/login")}
          aria-label="Add new account"
          sx={{
            mt: 3,
            borderColor: "#1B0D3F",
            color: "#1B0D3F",
            "&:hover": { borderColor: "#2D1B69", backgroundColor: "#F5F5F5" },
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
          }}
        >
          Add New Account
        </Button>
      </Box>
    </Box>
  );
};

export default SwitchAccount;
