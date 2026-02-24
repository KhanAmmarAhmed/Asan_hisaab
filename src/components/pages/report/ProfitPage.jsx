import React, { useContext, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Chip,
} from "@mui/material";
import GenericDateField from "../../generic/GenericDateField";
import PrintIcon from "@mui/icons-material/Print";
import { DataContext, parseAmount } from "@/context/DataContext";

const PURPLE = "#2E266D";

export default function ProfitPage() {
    const { income, expenses } = useContext(DataContext);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const inDateRange = (itemDate) => {
        if (!fromDate && !toDate) return true;
        const d = new Date(itemDate);
        if (fromDate && d < new Date(fromDate)) return false;
        if (toDate && d > new Date(toDate)) return false;
        return true;
    };

    const filteredIncome = useMemo(() =>
        income.filter(item => inDateRange(item.date)),
        [income, fromDate, toDate]
    );

    const filteredExpense = useMemo(() =>
        expenses.filter(item => inDateRange(item.date)),
        [expenses, fromDate, toDate]
    );

    const totalIncome = useMemo(() =>
        filteredIncome.reduce((sum, item) => sum + parseAmount(item.amount), 0),
        [filteredIncome]
    );

    const totalExpense = useMemo(() =>
        filteredExpense.reduce((sum, item) => sum + parseAmount(item.amount), 0),
        [filteredExpense]
    );

    const grossProfit = totalIncome - totalExpense;
    const hasData = filteredIncome.length > 0 || filteredExpense.length > 0;

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>
                Profit &amp; Loss Report
            </Typography>

            {/* Filters */}
            <Box display={{ md: "flex", xs: "block", sm: "flex" }} justifyContent="space-between" mb={2} flexWrap="wrap">
                <Box display="flex" gap={2} alignItems="center" mb={{ md: 0, xs: 2 }}>
                    <GenericDateField
                        label="From"
                        value={fromDate}
                        onChange={(v) => setFromDate(v?.target?.value ?? v ?? "")}
                    />
                    <GenericDateField
                        label="To"
                        value={toDate}
                        onChange={(v) => setToDate(v?.target?.value ?? v ?? "")}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => { /* filtering is reactive */ }}
                        sx={{ backgroundColor: PURPLE, height: 40, px: 4, flexShrink: 1 }}
                    >
                        Generate
                    </Button>
                    {(fromDate || toDate) && (
                        <Button size="small" onClick={() => { setFromDate(""); setToDate(""); }}>
                            Clear
                        </Button>
                    )}
                </Box>
                <Box flexGrow={1} />
                {hasData && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<PrintIcon />}
                        sx={{ backgroundColor: PURPLE, height: 40 }}
                        onClick={() => window.print()}
                    >
                        Print PDF
                    </Button>
                )}
            </Box>

            {!hasData && (
                <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 0.5 }}>
                    <Typography color="text.secondary">
                        No income or expense entries found. Add entries from the Income and Expense pages.
                    </Typography>
                </Paper>
            )}

            {/* Income Section */}
            {filteredIncome.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 0.5, mb: 2 }}>
                    <Box sx={{ backgroundColor: PURPLE, color: "#fff", px: 3, py: 1.5, borderRadius: "6px 6px 0 0" }}>
                        <Typography fontWeight={600}>Income</Typography>
                    </Box>
                    <Box p={3}>
                        {filteredIncome.map((item, idx) => (
                            <Box key={idx} display="flex" justifyContent="space-between" mb={1} alignItems="center">
                                <Box>
                                    <Typography>{item.customerName || item.accountHead || "—"}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.accountHead} &bull; {item.paymentMethod} &bull; {item.date}
                                    </Typography>
                                </Box>
                                <Typography fontWeight={500} color="green">
                                    Rs. {Number(item.amount || 0).toLocaleString()}/-
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight={600}>Total Income</Typography>
                            <Typography fontWeight={600} color="green">Rs. {totalIncome.toLocaleString()}/-</Typography>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Expense Section */}
            {filteredExpense.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 0.5 }}>
                    <Box sx={{ backgroundColor: PURPLE, color: "#fff", px: 3, py: 1.5, borderRadius: "6px 6px 0 0" }}>
                        <Typography fontWeight={600}>Expense</Typography>
                    </Box>
                    <Box p={3}>
                        {filteredExpense.map((item, idx) => (
                            <Box key={idx} display="flex" justifyContent="space-between" mb={1} alignItems="center">
                                <Box>
                                    <Typography>{item.customerName || item.accountHead || "—"}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.accountHead} &bull; {item.paymentMethod} &bull; {item.date}
                                    </Typography>
                                </Box>
                                <Typography fontWeight={500} color="error">
                                    Rs. {Number(item.amount || 0).toLocaleString()}/-
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography fontWeight={600}>Total Expense</Typography>
                            <Typography fontWeight={600} color="error">Rs. {totalExpense.toLocaleString()}/-</Typography>
                        </Box>

                        <Divider />

                        <Box display="flex" justifyContent="space-between" mt={2} alignItems="center">
                            <Typography fontWeight={700} color={grossProfit >= 0 ? "green" : "error"}>
                                {grossProfit >= 0 ? "Gross Profit" : "Net Loss"}
                            </Typography>
                            <Chip
                                label={`Rs. ${Math.abs(grossProfit).toLocaleString()}/-`}
                                color={grossProfit >= 0 ? "success" : "error"}
                                sx={{ fontWeight: 700, fontSize: "0.95rem" }}
                            />
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Show profit summary even if only one section has data */}
            {hasData && filteredExpense.length === 0 && filteredIncome.length > 0 && (
                <Paper elevation={0} sx={{ borderRadius: 0.5, mt: 1 }}>
                    <Box p={3}>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={700} color="green">Gross Profit</Typography>
                            <Chip label={`Rs. ${grossProfit.toLocaleString()}/-`} color="success" sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
