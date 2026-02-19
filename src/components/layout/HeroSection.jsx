import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTab } from "@/context/TabContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/components/assets/logo.png";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
  { key: "invoices", label: "Invoices" },
  { key: "cashbook", label: "Cashbook" },
  { key: "report", label: "Report", hasDropdown: true },
];

const CREATE_ROUTES = ["/projects", "/customers", "/vendors", "/employees"];

export default function HeroSection() {
  const { activeTab, setActiveTab } = useTab();
  const [reportAnchor, setReportAnchor] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tabKey, event, hasDropdown = false) => {
    if (hasDropdown) {
      setReportAnchor(event.currentTarget);
      return; // Don't change activeTab yet for dropdown
    }
    setActiveTab(tabKey);

    // Navigate home if currently on a create page
    if (CREATE_ROUTES.includes(location.pathname)) {
      navigate("/");
    }
  };

  const handleMenuClick = (path, tabKey) => {
    setReportAnchor(null);
    setActiveTab(tabKey);
    navigate(path);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #E0E0E0",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          height: { xs: 40, md: 70 },
          width: "auto",
          objectFit: "contain",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")} // optional: go to dashboard
      />

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, md: 1 },
          mx: 2,
          flexWrap: "nowrap",
          overflow: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              onClick={(e) => handleTabClick(tab.key, e, tab.hasDropdown)}
              endIcon={
                tab.hasDropdown ? (
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                ) : undefined
              }
              sx={{
                px: { xs: 1.5, md: 2.5 },
                py: 0.8,
                borderRadius: "20px",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                fontWeight: isActive ? 600 : 500,
                whiteSpace: "nowrap",
                color: isActive ? "#FFFFFF" : "#1B0D3F",
                backgroundColor: isActive ? "#1B0D3F" : "transparent",
                "&:hover": {
                  backgroundColor: isActive ? "#2D1B69" : "#F5F5F5",
                },
                textTransform: "none",
                minWidth: "auto",
              }}
            >
              {tab.label}
            </Button>
          );
        })}
        <Menu
          anchorEl={reportAnchor}
          open={Boolean(reportAnchor)}
          onClose={() => setReportAnchor(null)}
        >
          <MenuItem
            sx={{ fontWeight: 600 }}
            onClick={() => handleMenuClick("/profit", "report")}
          >
            Profit
          </MenuItem>
          <MenuItem
            sx={{ fontWeight: 600 }}
            onClick={() => handleMenuClick("/cash-in-out", "report")}
          >
            Cash in / out
          </MenuItem>
          <MenuItem
            sx={{ fontWeight: 600 }}
            onClick={() => handleMenuClick("/ledger", "report")}
          >
            Ledger
          </MenuItem>
        </Menu>
      </Box>

      {/* User Avatar */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#1B0D3F",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        U
      </Avatar>
    </Box>
  );
}
