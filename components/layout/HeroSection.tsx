"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTab, type TabKey } from "@/context/TabContext";

const tabs: { key: TabKey; label: string; hasDropdown?: boolean }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
  { key: "invoices", label: "Invoices" },
  { key: "cashbook", label: "Cashbook" },
  { key: "report", label: "Report", hasDropdown: true },
];

export default function HeroSection() {
  const { activeTab, setActiveTab } = useTab();
  const [reportAnchor, setReportAnchor] = React.useState<null | HTMLElement>(
    null
  );

  const handleTabClick = (tab: TabKey, event: React.MouseEvent<HTMLElement>) => {
    if (tab === "report") {
      setReportAnchor(event.currentTarget);
    }
    setActiveTab(tab);
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
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#1B0D3F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box
          component="span"
          sx={{
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          AH
        </Box>
      </Box>

      {/* Tab Navigation */}
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
              onClick={(e) => handleTabClick(tab.key, e)}
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
            onClick={() => {
              setReportAnchor(null);
            }}
          >
            Income Report
          </MenuItem>
          <MenuItem
            onClick={() => {
              setReportAnchor(null);
            }}
          >
            Expense Report
          </MenuItem>
          <MenuItem
            onClick={() => {
              setReportAnchor(null);
            }}
          >
            Balance Sheet
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
