import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTab } from "@/context/TabContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/components/assets/logo.png";
import { useTheme, useMediaQuery } from "@mui/material";

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
  // const { activeTab, setActiveTab } = useTab();
  const [reportAnchor, setReportAnchor] = React.useState(null);
  const [createAnchor, setCreateAnchor] = React.useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [mobileReportOpen, setMobileReportOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreate = (path) => {
    setCreateAnchor(null);
    navigate(path);
  };

  const TAB_ROUTES = {
    dashboard: "/dashboard",
    income: "/income",
    expense: "/expense",
    invoices: "/invoices",
    cashbook: "/cashbook",
    report: "/profit", // default report route
  };

  const handleTabClick = (tabKey, event, hasDropdown = false) => {
    if (hasDropdown && !isMobile) {
      setReportAnchor(event.currentTarget);
      return;
    }

    if (hasDropdown && isMobile) {
      setMobileReportOpen(!mobileReportOpen);
      return;
    }

    navigate(TAB_ROUTES[tabKey]);

    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleMenuClick = (path) => {
    setReportAnchor(null);
    navigate(path);

    if (isMobile) {
      setMobileDrawerOpen(false);
      setMobileReportOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: "70%",
          maxWidth: "300px",
          backgroundColor: "#FFFFFF",
          padding: "16px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton onClick={() => setMobileDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tabs.map((tab) => {
          const isActive =
            location.pathname === TAB_ROUTES[tab.key] ||
            (tab.key === "report" &&
              ["/profit", "/cash-in-out", "/ledger"].includes(
                location.pathname,
              ));
          const showReportDropdown = tab.hasDropdown && mobileReportOpen;

          return (
            <Box key={tab.key}>
              <Button
                onClick={(e) => handleTabClick(tab.key, e, tab.hasDropdown)}
                endIcon={
                  tab.hasDropdown ? (
                    mobileReportOpen ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )
                  ) : undefined
                }
                fullWidth
                sx={{
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FFFFFF" : "#1B0D3F",
                  backgroundColor: isActive ? "#1B0D3F" : "transparent",
                  "&:hover": {
                    backgroundColor: isActive ? "#2D1B69" : "#F5F5F5",
                  },
                  textTransform: "none",
                }}
              >
                {tab.label}
              </Button>

              {/* Mobile Report Submenu */}
              {tab.hasDropdown && showReportDropdown && (
                <Box
                  sx={{
                    ml: 2,
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => handleMenuClick("/profit", "report")}
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      color: "#1B0D3F",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "#F5F5F5",
                      },
                      textTransform: "none",
                    }}
                  >
                    Profit
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleMenuClick("/cash-in-out", "report")}
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      color: "#1B0D3F",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "#F5F5F5",
                      },
                      textTransform: "none",
                    }}
                  >
                    Cash in / out
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleMenuClick("/ledger", "report")}
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      color: "#1B0D3F",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "#F5F5F5",
                      },
                      textTransform: "none",
                    }}
                  >
                    Ledger
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );

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
      {/* Logo and Mobile Menu Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          onClick={handleLogoClick}
        />

        {/* Mobile Menu Toggle - Right after logo */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileDrawerOpen(true)}
            sx={{
              ml: 1,
              color: "#1B0D3F",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Desktop Tabs */}
      {!isMobile && (
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
            const isActive =
              location.pathname === TAB_ROUTES[tab.key] ||
              (tab.key === "report" &&
                ["/profit", "/cash-in-out", "/ledger"].includes(
                  location.pathname,
                ));
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
      )}

      {/* User Avatar */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#1B0D3F",
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={(e) => setCreateAnchor(e.currentTarget)}
      >
        U
      </Avatar>

      <Menu
        anchorEl={createAnchor}
        open={Boolean(createAnchor)}
        onClose={() => setCreateAnchor(null)}
      >
        <MenuItem
          sx={{ fontWeight: 600 }}
          // onClick={() => handleCreate("/projects")}
        >
          Accounts Settings
        </MenuItem>
        <MenuItem
          sx={{ fontWeight: 600 }}
          // onClick={() => handleCreate("/customers")}
        >
          Switch Account
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      {renderMobileMenu()}
    </Box>
  );
}
