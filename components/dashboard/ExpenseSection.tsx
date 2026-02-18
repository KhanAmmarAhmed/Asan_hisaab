"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface ExpenseCardProps {
  title: string;
  subtitle: string;
  previousAmount: string;
  currentAmount: string;
  icon: React.ReactNode;
  accentColor: string;
}

function ExpenseCard({
  title,
  subtitle,
  previousAmount,
  currentAmount,
  icon,
  accentColor,
}: ExpenseCardProps) {
  return (
    <Card
      sx={{
        flex: "1 1 calc(50% - 8px)",
        minWidth: 150,
        borderRadius: 3,
        position: "relative",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#1B0D3F", fontSize: "0.9rem" }}
              >
                {title}
              </Typography>
              <ArrowDownwardIcon
                sx={{ fontSize: 18, color: "#4CAF50", ml: 0.5 }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#999", fontSize: "0.75rem" }}
            >
              {subtitle}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ color: "#999", fontSize: "0.75rem" }}
            >
              {previousAmount}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mt: 1,
            color: "#1B0D3F",
            fontSize: "1.05rem",
          }}
        >
          {currentAmount}
        </Typography>
      </CardContent>
    </Card>
  );
}

const expenseData: ExpenseCardProps[] = [
  {
    title: "Today",
    subtitle: "Yesterday",
    previousAmount: "Rs 0",
    currentAmount: "Rs. 0",
    icon: <CalendarTodayIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    accentColor: "#5C6BC0",
  },
  {
    title: "This Week",
    subtitle: "Last Week",
    previousAmount: "Rs 0",
    currentAmount: "Rs. 0",
    icon: <DateRangeIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    accentColor: "#26A69A",
  },
  {
    title: "This Month",
    subtitle: "Last Month",
    previousAmount: "Rs 0",
    currentAmount: "Rs. 0",
    icon: <CalendarMonthIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    accentColor: "#5C6BC0",
  },
  {
    title: "This Year",
    subtitle: "Last Year",
    previousAmount: "Rs 0",
    currentAmount: "Rs. 0",
    icon: <EventNoteIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    accentColor: "#26A69A",
  },
];

export default function ExpenseSection() {
  return (
    <Card sx={{ borderRadius: 3, flex: 1, minWidth: 300 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2, color: "#1B0D3F", fontSize: "1.2rem" }}
        >
          Expense
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {expenseData.map((item) => (
            <ExpenseCard key={item.title} {...item} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
