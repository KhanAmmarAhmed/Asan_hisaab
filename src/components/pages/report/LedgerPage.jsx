

import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
} from "@mui/material";
import GenericDateField from "../../generic/GenericDateField";
import PrintIcon from "@mui/icons-material/Print";

const PURPLE = "#2E266D";

export default function LedgerPage() {
    // 🔹 Dynamic Income Table Data (Replace with API later)
    const [incomeData] = useState([
        { id: 1, title: "Salary", amount: 35000, date: "2026-02-01" },
        { id: 2, title: "Mr. Adnan Tariq", amount: 25000, date: "2026-02-10" },
    ]);

    // 🔹 Dynamic Expense Table Data
    const [expenseData] = useState([
        { id: 1, title: "Salary", amount: 15000, date: "2026-02-05" },
    ]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    // 🔹 Filter by Date
    const filteredIncome = useMemo(() => {
        return incomeData.filter((item) => {
            if (!fromDate || !toDate) return true;
            return item.date >= fromDate && item.date <= toDate;
        });
    }, [incomeData, fromDate, toDate]);

    const filteredExpense = useMemo(() => {
        return expenseData.filter((item) => {
            if (!fromDate || !toDate) return true;
            return item.date >= fromDate && item.date <= toDate;
        });
    }, [expenseData, fromDate, toDate]);

    // 🔹 Calculations
    const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = filteredExpense.reduce((sum, item) => sum + item.amount, 0);
    const grossProfit = totalIncome - totalExpense;

    const hasData =
        filteredIncome.length > 0 || filteredExpense.length > 0;


    return (
        <Box >
            {/* Header */}
            <Typography variant="h5" fontWeight={600} mb={2}>
                Ledger
            </Typography>

            {/* Filters */}

            <Box display={{ md: "flex", xs: "block", sm: "flex" }} justifyContent="space-between" mb={2} flexWrap="wrap">
                <Box display="flex" gap={2} alignItems="center" mb={{ md: 0, xs: 2 }}>
                    <GenericDateField
                        label="From"
                        value={fromDate}
                        onChange={(valOrEvent) =>
                            setFromDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
                        }
                    />


                    <GenericDateField
                        label="To"
                        value={toDate}
                        onChange={(valOrEvent) =>
                            setToDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
                        }
                    />

                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            backgroundColor: PURPLE,
                            height: 40,
                            px: 4,
                            flexShrink: 1,
                        }}
                    >
                        Generate
                    </Button>
                </Box>

                <Box flexGrow={1} />

            </Box>


            {/* Income Section */}
            <Paper elevation={0} sx={{ borderRadius: 0.5, mb: 2 }}>
                <Box
                    sx={{
                        backgroundColor: PURPLE,
                        color: "#fff",
                        px: 3,
                        py: 1.5,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                    }}
                >
                    <Typography fontWeight={600}>Income</Typography>
                </Box>

                <Box p={3}>
                    {filteredIncome.map((item) => (
                        <Box
                            key={item.id}
                            display="flex"
                            justifyContent="space-between"
                            mb={1}
                        >
                            <Typography>{item.title}</Typography>
                            <Typography>Rs. {item.amount.toLocaleString()}/-</Typography>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Total Income</Typography>
                        <Typography fontWeight={600}>
                            Rs. {totalIncome.toLocaleString()}/-
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            <Box display="flex" justifyContent="flex-end">
                {hasData && (
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PrintIcon />}
                            sx={{
                                backgroundColor: PURPLE,
                                height: 40,
                                "&:hover": { backgroundColor: "#251b4f" },
                            }}
                            onClick={() => window.print()}
                        >
                            Print PDF
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: PURPLE,
                                height: 40,
                                "&:hover": { backgroundColor: "#251b4f" },
                            }}
                            onClick={() => {
                                // Add your download logic here
                                console.log("Download clicked");
                            }}
                        >
                            Download
                        </Button>
                    </Box>
                )}
            </Box>



        </Box>
    );
}
