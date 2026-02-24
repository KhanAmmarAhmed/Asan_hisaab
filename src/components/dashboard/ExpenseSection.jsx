import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DataContext } from "@/context/DataContext";

const ICONS = [
  <CalendarTodayIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <DateRangeIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <CalendarMonthIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <EventNoteIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
];
const COLORS = ["#5C6BC0", "#26A69A", "#5C6BC0", "#26A69A"];

function ExpenseCard({ title, subtitle, previousAmount, currentAmount, icon, accentColor }) {
  return (
    <Card
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" },
        borderRadius: 0.5,
        position: "relative",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 60,
              height: 100,
              backgroundColor: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1B0D3F", fontSize: "0.9rem" }}>
                {title}
              </Typography>

              <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem", display: "flex", flexDirection: "row-reverse" }}>
                {subtitle}
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: "#999", fontSize: "0.75rem", display: "flex", flexDirection: "row-reverse" }}>
                {previousAmount}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: "#1B0D3F", fontSize: "1.05rem" }}>
              {currentAmount}
            </Typography>
          </Box>
          <ArrowDownwardIcon sx={{ fontSize: 18, color: "#4CAF50", ml: 0.5 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ExpenseSection() {
  const { getExpenseSummary } = useContext(DataContext);

  return (
    <Card sx={{ borderRadius: 1, flex: { xs: "1 1 100%", md: 1 }, minWidth: 0 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1B0D3F", fontSize: "1.2rem" }}>
          Expense
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
          {getExpenseSummary.map((item, idx) => (
            <ExpenseCard
              key={item.period}
              title={item.period}
              subtitle={item.label}
              previousAmount={item.previous}
              currentAmount={item.current}
              icon={ICONS[idx]}
              accentColor={COLORS[idx]}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
