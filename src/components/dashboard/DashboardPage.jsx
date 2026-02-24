import React, { useContext } from "react";
import Box from "@mui/material/Box";
import BalanceCards from "./BalanceCards";
import ExpenseSection from "./ExpenseSection";
import SummaryChart from "./SummaryChart";
import { DataContext } from "@/context/DataContext";

export default function DashboardPage() {
  const { totalIncome, totalReceivable, totalPayables } = useContext(DataContext);

  const fmt = (n) => `Rs. ${n.toLocaleString()}`;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        <BalanceCards title="Opening Balance" amount={fmt(totalIncome)} />
        <BalanceCards title="Receivable" amount={fmt(totalReceivable)} />
        <BalanceCards title="Payables" amount={fmt(totalPayables)} />
      </Box>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", width: "100%" }}>
        <ExpenseSection />
        <SummaryChart />
      </Box>
    </Box>
  );
}
