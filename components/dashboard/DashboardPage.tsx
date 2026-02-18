"use client";

import React from "react";
import Box from "@mui/material/Box";
import BalanceCard from "./BalanceCards";
import ExpenseSection from "./ExpenseSection";
import SummaryChart from "./SummaryChart";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* <BalanceCard /> */}
      <BalanceCard
        title="Opening Balance"
        amount="Rs. 50,000"
        color="#1B0D3F"
      />

      <BalanceCard
        title="Receivable"
        amount="Rs. 25,000"
        color="#4CAF50"
      />

      <BalanceCard
        title="Payables"
        amount="Rs. 15,000"
        color="#E53935"
      />
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <ExpenseSection />
        <SummaryChart />
      </Box>
    </Box>
  );
}
