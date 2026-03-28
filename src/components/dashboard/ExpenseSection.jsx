import React, { useContext, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataContext } from "@/context/DataContext";

const ICONS = [
  <CalendarTodayIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <DateRangeIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <CalendarMonthIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  <EventNoteIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
];
const COLORS = ["#5C6BC0", "#26A69A", "#5C6BC0", "#26A69A"];
const PERIOD_TYPES = ["day", "week", "month", "year"];

/**
 * Parse amount strings like "Rs. 40,000" into numeric value
 */
const parseAmount = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

/**
 * Get transaction date from various formats
 */
const getTransactionDateObject = (item) => {
  const dateStr = item?.date || item?.createdAt || item?.created_at;
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Calculate expense total for a date range
 */
const getExpenseForRange = (expenses, fromDate, toDate) => {
  return expenses
    .filter((item) => {
      const d = getTransactionDateObject(item);
      return d && d >= fromDate && d <= toDate;
    })
    .reduce((sum, item) => sum + parseAmount(item.amount), 0);
};

/**
 * Format amount as currency
 */
const formatAmount = (amount) => `Rs. ${Math.round(amount).toLocaleString()}`;

/**
 * Calculate periods data for navigation
 */
const getPeriodData = (expenses, periodType, offset = 0) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const totalOffset = offset; // negative for past, 0 for current

  let fromDate, toDate, label, dateLabel;

  if (periodType === "day") {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + totalOffset);
    fromDate = targetDate;
    toDate = new Date(targetDate);
    toDate.setHours(23, 59, 59, 999);
    label = targetDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    dateLabel = `${label} - Day`;
  } else if (periodType === "week") {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + totalOffset * 7 - today.getDay());
    const endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() + 6);
    fromDate = targetDate;
    toDate = new Date(endDate);
    toDate.setHours(23, 59, 59, 999);
    const weekNum = Math.ceil(targetDate.getDate() / 7);
    label = `Week ${Math.ceil((targetDate.getDate() + targetDate.getDay()) / 7)}`;
    dateLabel = `${targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })} (${label})`;
  } else if (periodType === "month") {
    const targetDate = new Date(
      today.getFullYear(),
      today.getMonth() + totalOffset,
      1,
    );
    const endDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
    );
    fromDate = targetDate;
    toDate = new Date(endDate);
    toDate.setHours(23, 59, 59, 999);
    label = targetDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    dateLabel = `${label} - Month`;
  } else if (periodType === "year") {
    const targetYear = today.getFullYear() + totalOffset;
    fromDate = new Date(targetYear, 0, 1);
    toDate = new Date(targetYear, 11, 31);
    toDate.setHours(23, 59, 59, 999);
    label = `${targetYear}`;
    dateLabel = `${label} - Year`;
  }

  const total = getExpenseForRange(expenses, fromDate, toDate);

  return {
    current: formatAmount(total),
    label,
    dateLabel,
    fromDate,
    toDate,
  };
};

function ExpenseCard({
  title,
  currentAmount,
  icon,
  accentColor,
  periodType,
  expenses,
}) {
  const [offset, setOffset] = useState(0);

  const data = useMemo(
    () => getPeriodData(expenses, periodType, offset),
    [expenses, periodType, offset],
  );

  const handlePrevious = () => {
    setOffset((prev) => prev - 1);
  };

  const handleNext = () => {
    if (offset < 0) {
      setOffset((prev) => prev + 1);
    }
  };

  // Determine if we can go forward (only if offset < 0)
  const canGoNext = offset < 0;

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#1B0D3F", fontSize: "0.9rem" }}
              >
                {offset === 0 ? title : data.label}
              </Typography>
              {offset !== 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: "#666", fontSize: "0.75rem", mt: 0.5 }}
                >
                  {data.dateLabel}
                </Typography>
              )}
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
              {data.current}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Tooltip title={`View previous ${periodType}`}>
              <IconButton
                size="small"
                onClick={handlePrevious}
                sx={{
                  color: "#4CAF50",
                  p: 0.5,
                  "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.1)" },
                }}
              >
                <ArrowDownwardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {canGoNext && (
              <Tooltip title={`View next ${periodType}`}>
                <IconButton
                  size="small"
                  onClick={handleNext}
                  sx={{
                    color: "#FF9800",
                    p: 0.5,
                    "&:hover": { backgroundColor: "rgba(255, 152, 0, 0.1)" },
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ExpenseSection() {
  const { expenses } = useContext(DataContext);

  return (
    <Card
      sx={{ borderRadius: 1, flex: { xs: "1 1 100%", md: 1 }, minWidth: 0 }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2, color: "#1B0D3F", fontSize: "1.2rem" }}
        >
          Expense
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
          {PERIOD_TYPES.map((periodType, idx) => (
            <ExpenseCard
              key={periodType}
              title={
                periodType === "day"
                  ? "Yesterday"
                  : periodType === "week"
                    ? "This Week"
                    : periodType === "month"
                      ? "This Month"
                      : "This Year"
              }
              icon={ICONS[idx]}
              accentColor={COLORS[idx]}
              periodType={periodType}
              expenses={expenses}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
