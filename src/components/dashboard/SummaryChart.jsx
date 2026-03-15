// import React, { useContext, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { DataContext } from "@/context/DataContext";

// export default function SummaryChart() {
//   const { monthlyChartData } = useContext(DataContext);
//   const [period, setPeriod] = useState("year");

//   const chartData =
//     period === "year"
//       ? monthlyChartData
//       : period === "month"
//         ? monthlyChartData.slice(-4)
//         : monthlyChartData.slice(-7);

//   const handleChange = (event) => setPeriod(event.target.value);

//   return (
//     <Card
//       sx={{ borderRadius: 1, flex: { xs: "1 1 100%", md: 1 }, minWidth: 0 }}
//     >
//       <CardContent sx={{ p: 2.5 }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 700, color: "#1B0D3F" }}>
//             Summary
//           </Typography>
//           <Select
//             value={period}
//             onChange={handleChange}
//             size="small"
//             sx={{ minWidth: 90 }}
//           >
//             <MenuItem value="year">Year</MenuItem>
//             <MenuItem value="month">Month</MenuItem>
//             <MenuItem value="week">Week</MenuItem>
//           </Select>
//         </Box>
//         <Box sx={{ width: "100%", height: 280 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={chartData}
//               margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
//               barGap={4}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickFormatter={(v) => `Rs. ${v.toLocaleString()}`}
//               />
//               <Tooltip
//                 formatter={(v) => [`Rs. ${v.toLocaleString()}`, undefined]}
//               />
//               <Legend
//                 iconType="square"
//                 iconSize={10}
//                 wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }}
//               />
//               <Bar
//                 dataKey="income"
//                 fill="#4CAF50"
//                 radius={[4, 4, 0, 0]}
//                 barSize={14}
//                 minPointSize={2}
//               />
//               <Bar
//                 dataKey="expense"
//                 fill="#E53935"
//                 radius={[4, 4, 0, 0]}
//                 barSize={14}
//                 minPointSize={2}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }
import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
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
  const { monthlyChartData, weeklyChartData } = useContext(DataContext);
  const [period, setPeriod] = useState("year");

  // Choose dataset and slicing based on selected period
  const getChartData = () => {
    switch (period) {
      case "year":
        return monthlyChartData; // all 12 months
      case "month":
        return monthlyChartData.slice(-4); // last 4 months
      case "week":
        return weeklyChartData.slice(-7); // last 7 weeks
      default:
        return monthlyChartData;
    }
  };

  const chartData = getChartData();

  const handleChange = (event) => setPeriod(event.target.value);

  return (
    <Card
      sx={{ borderRadius: 1, flex: { xs: "1 1 100%", md: 1 }, minWidth: 0 }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1B0D3F" }}>
            Summary
          </Typography>
          <Select
            value={period}
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 90 }}
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
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                // Use 'weekLabel' when period is week, otherwise 'month'
                dataKey={period === "week" ? "weekLabel" : "month"}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `Rs. ${v.toLocaleString()}`}
              />
              <Tooltip
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, undefined]}
              />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }}
              />
              <Bar
                dataKey="income"
                fill="#4CAF50"
                radius={[4, 4, 0, 0]}
                barSize={14}
                minPointSize={2}
              />
              <Bar
                dataKey="expense"
                fill="#E53935"
                radius={[4, 4, 0, 0]}
                barSize={14}
                minPointSize={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
