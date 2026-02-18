import React, { useState } from "react";
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

const monthlyData = [
  { month: "Jan", income: 30, expense: 20 },
  { month: "Feb", income: 25, expense: 15 },
  { month: "Mar", income: 40, expense: 18 },
  { month: "Apr", income: 35, expense: 22 },
  { month: "May", income: 55, expense: 30 },
  { month: "Jun", income: 65, expense: 25 },
  { month: "Jul", income: 60, expense: 35 },
  { month: "Aug", income: 45, expense: 40 },
  { month: "Sep", income: 80, expense: 95 },
  { month: "Oct", income: 70, expense: 50 },
  { month: "Nov", income: 75, expense: 45 },
  { month: "Dec", income: 55, expense: 35 },
];

export default function SummaryChart() {
  const [period, setPeriod] = useState("year");

  const handleChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <Card sx={{ borderRadius: 1, flex: 1, minWidth: 300 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1B0D3F", fontSize: "1.2rem" }}
          >
            Summary
          </Typography>
          <Select
            value={period}
            onChange={handleChange}
            size="small"
            sx={{
              minWidth: 90,
              fontSize: "0.85rem",
              borderRadius: 0.5,
              "& .MuiSelect-select": { py: 0.8 },
            }}
          >
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
          </Select>
        </Box>
        <Box sx={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              barGap={1}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#4CAF50"
                radius={[7, 7, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#E53935"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
