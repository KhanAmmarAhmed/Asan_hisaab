import React, { useContext, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import GenericDateField from "../../generic/GenericDateField";
import GenericModal from "../../generic/GenericModal";
import { DataContext, parseAmount } from "@/context/DataContext";

export default function CashInOutPage() {
    const { income, expenses } = useContext(DataContext);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Merge income + expenses into a unified history
    const transactionHistory = useMemo(() => {
        const incomeEntries = income.map(i => ({
            id: i.id || Date.now() + Math.random(),
            bankName: i.customerName || i.accountHead || "Income",
            amount: parseAmount(i.amount),
            type: "in",
            date: i.date,
            description: i.accountHead || "Received Income",
            voucher: i.voucher,
            paymentMethod: i.paymentMethod
        }));

        const expenseEntries = expenses.map(e => ({
            id: e.id || Date.now() + Math.random(),
            bankName: e.customerName || e.accountHead || "Expense",
            amount: parseAmount(e.amount),
            type: "out",
            date: e.date,
            description: e.accountHead || "Paid Expense",
            voucher: e.voucher,
            paymentMethod: e.paymentMethod
        }));

        return [...incomeEntries, ...expenseEntries]
            .filter((item) => {
                if (!fromDate && !toDate) return true;
                const d = new Date(item.date);
                if (fromDate && d < new Date(fromDate)) return false;
                if (toDate && d > new Date(toDate)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [income, expenses, fromDate, toDate]);

    const formatDate = (date) => {
        const d = new Date(date);
        return isNaN(d) ? date : d.toLocaleDateString("en-GB");
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={600}>
                    Cash In/Out History
                </Typography>
            </Box>

            {/* Date Filters */}
            <Box display="flex" gap={2} mb={2} width={{ xs: "100%", md: "40%" }}>
                <Box flex={1}>
                    <GenericDateField
                        label="From"
                        width="100%"
                        value={fromDate}
                        onChange={(v) => setFromDate(v?.target?.value ?? v ?? "")}
                    />
                </Box>
                <Box flex={1}>
                    <GenericDateField
                        label="To"
                        width="100%"
                        value={toDate}
                        onChange={(v) => setToDate(v?.target?.value ?? v ?? "")}
                    />
                </Box>
            </Box>

            {/* History List */}
            {transactionHistory.length === 0 ? (
                <Typography color="text.secondary">
                    No transactions found. Add Income or Expenses to see history here.
                </Typography>
            ) : (
                transactionHistory.map((item) => (
                    <Paper
                        key={item.id}
                        elevation={0}
                        onClick={() => {
                            setSelectedRow({
                                ...item,
                                voucher: item.voucher || String(item.id),
                                amountDisplay: `Rs. ${item.amount.toLocaleString()}`
                            });
                            setIsModalOpen(true);
                        }}
                        sx={{
                            p: 1.5,
                            mb: 1,
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #f0f0f0",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#F5F5F5" },
                        }}
                    >
                        {/* Left Side */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box
                                sx={{
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: item.type === "in" ? "#4CAF50" : "#E53935",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                    flexShrink: 0
                                }}
                            >
                                <Typography color="white" fontWeight={700} fontSize="0.9rem">
                                    {item.type === "in" ? "IN" : "OUT"}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography fontWeight={600} variant="body1">
                                    {item.bankName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.description} &bull; {item.paymentMethod || "N/A"}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right Side */}
                        <Box textAlign="right">
                            <Typography
                                fontWeight={700}
                                color={item.type === "in" ? "success.main" : "error.main"}
                            >
                                {item.type === "in" ? "+" : "-"} Rs. {Number(item.amount).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {formatDate(item.date)}
                            </Typography>
                        </Box>
                    </Paper>
                ))
            )}

            <GenericModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="Transaction Details"
                mode="detail"
                columns={2}
                selectedRow={selectedRow}
                fields={[
                    { id: "bankName", label: "Account/Entity" },
                    { id: "amountDisplay", label: "Amount" },
                    { id: "type", label: "Type" },
                    { id: "date", label: "Date" },
                    { id: "description", label: "Head/Description" },
                    { id: "paymentMethod", label: "Payment Method" },
                    { id: "voucher", label: "Voucher/ID" },
                ]}
                onPrint={() => window.print()}
            />
        </Box>
    );
}