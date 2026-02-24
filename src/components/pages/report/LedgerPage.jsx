import React, { useContext, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from "@mui/material";
import GenericDateField from "../../generic/GenericDateField";
import PrintIcon from "@mui/icons-material/Print";
import { DataContext, parseAmount } from "@/context/DataContext";

const PURPLE = "#2E266D";

export default function LedgerPage() {
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

    // Merge income + expenses into a unified ledger, sorted by date
    const ledgerEntries = useMemo(() => {
        const incomeEntries = income
            .filter(i => inDateRange(i.date))
            .map(i => ({
                date: i.date,
                description: i.customerName || i.accountHead || "Income",
                reference: i.paymentMethod || "—",
                debit: 0,
                credit: parseAmount(i.amount),
                type: "income",
                voucher: i.voucher,
            }));

        const expenseEntries = expenses
            .filter(e => inDateRange(e.date))
            .map(e => ({
                date: e.date,
                description: e.customerName || e.accountHead || "Expense",
                reference: e.paymentMethod || "—",
                debit: parseAmount(e.amount),
                credit: 0,
                type: "expense",
                voucher: e.voucher,
            }));

        return [...incomeEntries, ...expenseEntries]
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [income, expenses, fromDate, toDate]);

    // Running balance
    const ledgerWithBalance = useMemo(() => {
        let balance = 0;
        return ledgerEntries.map(entry => {
            balance += entry.credit - entry.debit;
            return { ...entry, balance };
        });
    }, [ledgerEntries]);

    const totalCredits = ledgerEntries.reduce((s, e) => s + e.credit, 0);
    const totalDebits = ledgerEntries.reduce((s, e) => s + e.debit, 0);
    const netBalance = totalCredits - totalDebits;

    const hasData = ledgerEntries.length > 0;

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>Ledger</Typography>

            {/* Filters */}
            <Box display={{ md: "flex", xs: "block" }} justifyContent="space-between" mb={2} flexWrap="wrap">
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
                        sx={{ backgroundColor: PURPLE, height: 40, px: 4 }}
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
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PrintIcon />}
                            sx={{ backgroundColor: PURPLE, height: 40, "&:hover": { backgroundColor: "#251b4f" } }}
                            onClick={() => window.print()}
                        >
                            Print PDF
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: PURPLE, height: 40, "&:hover": { backgroundColor: "#251b4f" } }}
                            onClick={() => console.log("Download clicked")}
                        >
                            Download
                        </Button>
                    </Box>
                )}
            </Box>

            {!hasData ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 0.5 }}>
                    <Typography color="text.secondary">
                        No ledger entries found. Add Income or Expense transactions to view here.
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={0} sx={{ borderRadius: 0.5, overflow: "hidden" }}>
                    <Box sx={{ backgroundColor: PURPLE, color: "#fff", px: 3, py: 1.5 }}>
                        <Typography fontWeight={600}>Transaction Ledger</Typography>
                    </Box>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "error.main" }}>Debit</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "success.main" }}>Credit</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ledgerWithBalance.map((entry, idx) => (
                                <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>{entry.description}</Typography>
                                            <Chip
                                                label={entry.type === "income" ? "Income" : "Expense"}
                                                size="small"
                                                color={entry.type === "income" ? "success" : "error"}
                                                sx={{ height: 18, fontSize: "0.65rem", mt: 0.3 }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>{entry.reference}</TableCell>
                                    <TableCell align="right" sx={{ color: "error.main" }}>
                                        {entry.debit > 0 ? `Rs. ${Number(entry.debit).toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "success.main" }}>
                                        {entry.credit > 0 ? `Rs. ${Number(entry.credit).toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: entry.balance >= 0 ? "success.main" : "error.main" }}>
                                        Rs. {Number(entry.balance).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Totals row */}
                            <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>Totals</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "error.main" }}>
                                    Rs. {totalDebits.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "success.main" }}>
                                    Rs. {totalCredits.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: netBalance >= 0 ? "success.main" : "error.main" }}>
                                    Rs. {netBalance.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
}
