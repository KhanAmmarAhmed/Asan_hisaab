import React from "react";
import Box from "@mui/material/Box";
import BalanceCards from "./BalanceCards";
import ExpenseSection from "./ExpenseSection";
import SummaryChart from "./SummaryChart";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        <BalanceCards title="Opening Balance" amount="Rs. 50,000" />
        <BalanceCards title="Receivable" amount="Rs. 25,000" />
        <BalanceCards title="Payables" amount="Rs. 15,000" />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <ExpenseSection />
        <SummaryChart />
      </Box>
    </Box>
  );
}
