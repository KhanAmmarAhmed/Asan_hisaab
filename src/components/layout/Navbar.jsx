import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [createAnchor, setCreateAnchor] = useState(null);
  const [setupAnchor, setSetupAnchor] = useState(null);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1B0D3F",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          position: "relative",
          minHeight: { xs: 52, sm: 56 },
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            letterSpacing: 0.5,
            color: "#FFFFFF",
          }}
        >
          Friends It Solutions
        </Typography>

        <Box
          sx={{
            position: "absolute",
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            color="inherit"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => setCreateAnchor(e.currentTarget)}
            sx={{
              fontSize: "0.85rem",
              color: "#FFFFFF",
              textTransform: "none",
            }}
          >
            Create
          </Button>
          <Menu
            anchorEl={createAnchor}
            open={Boolean(createAnchor)}
            onClose={() => setCreateAnchor(null)}
            sx={{}}
          >
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setCreateAnchor(null)}
            >
              <Link to="/projects">Projects</Link>
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setCreateAnchor(null)}
            >
              <Link to="/customers">Customers</Link>
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setCreateAnchor(null)}
            >
              <Link to="/vendors">Vendors</Link>
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setCreateAnchor(null)}
            >
              <Link to="/employees">Employees</Link>
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            startIcon={<SettingsIcon sx={{ fontSize: 18 }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => setSetupAnchor(e.currentTarget)}
            sx={{
              fontSize: "0.85rem",
              color: "#FFFFFF",
              textTransform: "none",
            }}
          >
            Setup
          </Button>
          <Menu
            anchorEl={setupAnchor}
            open={Boolean(setupAnchor)}
            onClose={() => setSetupAnchor(null)}
          >
            <MenuItem onClick={() => setSetupAnchor(null)}>
              Company Settings
            </MenuItem>
            <MenuItem onClick={() => setSetupAnchor(null)}>Categories</MenuItem>
            <MenuItem onClick={() => setSetupAnchor(null)}>
              Payment Methods
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
