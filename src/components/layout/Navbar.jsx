import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CompanyContext } from "@/context/CompanyContext";
import { useMemo } from "react";
// import { Modal } from "@mui/material";

export default function Navbar() {
  const { companyInfo } = useContext(CompanyContext);
  const [createAnchor, setCreateAnchor] = useState(null);
  const [setupAnchor, setSetupAnchor] = useState(null);
  const navigate = useNavigate();

  const handleCreate = (path) => {
    setCreateAnchor(null);
    navigate(path);
  };
  const formatCompanyName = useMemo(() => {
    if (!companyInfo?.name) return "";

    if (companyInfo.name.length < 6) return companyInfo.name;

    return companyInfo.name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");
  }, [companyInfo?.name]);

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
        <Box
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            letterSpacing: 0.5,
            color: "#FFFFFF",
            // display: { xs: "none", md: "inline" },
          }}
        >
          <Box
            sx={{
              display: { xs: "inline", md: "none" },
              fontWeight: 900,
              fontSize: "2rem",
            }}
          >
            {formatCompanyName}
          </Box>
          <Box sx={{ display: { xs: "none", md: "inline" } }}>
            {companyInfo?.name}
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 16,
            display: "flex",
            alignItems: "center",
            float: "right",
            gap: 1,
          }}
        >
          {/* ── "+ Create" dropdown ── */}
          <Button
            color="inherit"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            endIcon={
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 16,
                  display: { xs: "none", md: "inline-flex" }, // hide arrow on mobile
                }}
              />
            }
            onClick={(e) => setCreateAnchor(e.currentTarget)}
            sx={{
              fontSize: "0.85rem",
              color: "#FFFFFF",
              textTransform: "none",
              minWidth: "auto",
              px: { xs: 1, md: 2 },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "inline" } }}>Create</Box>
          </Button>

          <Menu
            anchorEl={createAnchor}
            open={Boolean(createAnchor)}
            onClose={() => setCreateAnchor(null)}
          >
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => handleCreate("/projects")}
            >
              Projects
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => handleCreate("/customers")}
            >
              Customers
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => handleCreate("/vendors")}
            >
              Vendors
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => handleCreate("/employees")}
            >
              Employees
            </MenuItem>
          </Menu>

          {/* ── "Setup" dropdown ── */}
          <Button
            color="inherit"
            startIcon={<SettingsIcon sx={{ fontSize: 18 }} />}
            endIcon={
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 16,
                  display: { xs: "none", md: "inline-flex" },
                }}
              />
            }
            onClick={(e) => setSetupAnchor(e.currentTarget)}
            sx={{
              fontSize: "0.85rem",
              color: "#FFFFFF",
              textTransform: "none",
              minWidth: "auto",
              px: { xs: 1, md: 2 },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "inline" } }}>Setup</Box>
          </Button>

          <Menu
            anchorEl={setupAnchor}
            open={Boolean(setupAnchor)}
            onClose={() => setSetupAnchor(null)}
          >
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setSetupAnchor(null)}
            >
              Company Settings
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setSetupAnchor(null)}
            >
              Categories
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 600 }}
              onClick={() => setSetupAnchor(null)}
            >
              Payment Methods
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
