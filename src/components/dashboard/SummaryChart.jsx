import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataContext } from "@/context/DataContext";

export default function SummaryChart() {
  const { monthlyChartData } = useContext(DataContext);
  const [period, setPeriod] = useState("year");

  // Slice data based on period selection
  const chartData = period === "year"
    ? monthlyChartData
    : period === "month"
      ? monthlyChartData.slice(-4)
      : monthlyChartData.slice(-7);

  const handleChange = (event) => {
    setPeriod(event.target.value);
  };
  console.log(monthlyChartData);

  return (
    <Card sx={{ borderRadius: 1, flex: { xs: "1 1 100%", md: 1 }, minWidth: 0 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1B0D3F", fontSize: "1.2rem" }}>
            Summary
          </Typography>
          <Select
            value={period}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 90, fontSize: "0.85rem", borderRadius: 0.5, "& .MuiSelect-select": { py: 0.8 } }}
          >
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
          </Select>
        </Box>
        <Box sx={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              barGap={1}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                formatter={(value) => [`Rs. ${value.toLocaleString()}`, undefined]}
              />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }} />
              <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[7, 7, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#E53935" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {monthlyChartData.every(d => d.income === 0 && d.expense === 0) && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
            Add income &amp; expenses to see your summary chart
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
