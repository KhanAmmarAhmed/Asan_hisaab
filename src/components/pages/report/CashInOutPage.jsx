import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Avatar,
} from "@mui/material";
import GenericDateField from "../../generic/GenericDateField";

const PURPLE = "#2E266D";

export default function CashInOutPage() {
    // 🔹 Sample Data (Replace with API later)
    const [transactions] = useState([
        {
            id: 1,
            bankName: "Meezan Bank",
            amount: 10000,
            type: "in", // in | out
            date: "2023-01-31",
        },
        {
            id: 2,
            bankName: "Alfalah Bank",
            amount: 10000,
            type: "in",
            date: "2023-01-31",
        },
    ]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 🔹 Filter by Date
    const filteredTransactions = useMemo(() => {
        return transactions.filter((item) => {
            if (!fromDate || !toDate) return true;
            return item.date >= fromDate && item.date <= toDate;
        });
    }, [transactions, fromDate, toDate]);

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB");
    };

    return (
        <Box>
            {/* Header */}
            <Typography variant="h5" fontWeight={600} mb={2}>
                Cash In/Out
            </Typography>

            {/* Date Filters */}
            <Box display="flex" gap={2} mb={2} width="40%">
                <Box flex={1}>
                    <GenericDateField
                        label="From"
                        width="100%"
                        value={fromDate}
                        onChange={(valOrEvent) =>
                            setFromDate(
                                valOrEvent?.target?.value ?? valOrEvent ?? ""
                            )
                        }
                    />
                </Box>
                <Box flex={1}>
                    <GenericDateField
                        label="To"
                        width="100%"
                        value={toDate}
                        onChange={(valOrEvent) =>
                            setToDate(
                                valOrEvent?.target?.value ?? valOrEvent ?? ""
                            )
                        }
                    />
                </Box>
            </Box>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
                <Typography color="text.secondary">
                    No transactions found for selected dates.
                </Typography>
            ) : (
                filteredTransactions.map((item) => (
                    <Paper
                        key={item.id}
                        elevation={0}
                        sx={{
                            p: 1,
                            mb: 1,
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        {/* Left Side */}
                        <Box display="flex" alignItems="center" gap={2} sx={{ height: "100%" }}>
                            <Box
                                sx={{
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: PURPLE,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                }}
                            >
                                <Typography color="white" fontWeight={600}>
                                    {item.bankName.charAt(0)}
                                </Typography>
                            </Box>

                            <Typography fontWeight={600}>
                                {item.bankName}
                            </Typography>
                        </Box>

                        {/* Right Side */}
                        <Box textAlign="right" display="flex" gap={5} justifyContent="center" alignItems="center">
                            <Typography
                                fontWeight={600}
                                color={
                                    item.type === "in"
                                        ? "green"
                                        : "red"
                                }
                            >
                                Rs. {item.amount.toLocaleString()}/-
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.secondary"
                            >
                                {formatDate(item.date)}
                            </Typography>
                        </Box>
                    </Paper>
                ))
            )}
        </Box>
    );
}