import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import GenericDateField from "../../generic/GenericDateField";
import GenericModal from "../../generic/GenericModal";

const PURPLE = "#2E266D";

export default function CashInOutPage() {
    // 🔹 Sample Data (Replace with API later)
    const [transactions, setTransactions] = useState([
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalMode, setModalMode] = useState("add");

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

    const handleAddTransaction = (formData) => {
        const newTransaction = {
            id: transactions.length + 1,
            bankName: formData.bankName || "Unknown Bank",
            amount: formData.amount || 0,
            type: formData.type || "in",
            date: new Date().toISOString().split("T")[0],
            description: formData.description || "",
        };
        setTransactions([newTransaction, ...transactions]);
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={600}>
                    Cash In/Out
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setModalMode("add");
                        setSelectedRow(null);
                        setIsModalOpen(true);
                    }}
                    sx={{
                        backgroundColor: "#1B0D3F",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: 14,
                        px: 2.5,
                        "&:hover": { backgroundColor: "#2D1B69" },
                    }}
                >
                    Add
                </Button>
            </Box>

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
                        onClick={() => {
                            setSelectedRow({
                                ...item,
                                voucher: String(item.id),
                                amount: `Rs. ${Number(item.amount).toLocaleString()}`
                            });
                            setModalMode("detail-actions");
                            setIsModalOpen(true);
                        }}
                        sx={{
                            p: 1,
                            mb: 1,
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#FFFFFF",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#F5F5F5" },
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
                                Rs. {Number(item.amount).toLocaleString()}/-
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

            <GenericModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === "add" ? "Add Transaction" : "Transaction Detail"}
                mode={modalMode}
                columns={2}
                showAddFileButton={modalMode === "add"}
                selectedRow={selectedRow}
                onSubmit={handleAddTransaction}
                fields={
                    modalMode === "add"
                        ? [
                            { id: "bankName", label: "Bank Name" },
                            { id: "amount", label: "Amount" },
                            { id: "type", label: "Type (in/out)" },
                            { id: "date", label: "Date" }, // Optional in form if auto-set
                            { id: "description", label: "Description", type: "textarea", rows: 2 },
                        ]
                        : [
                            { id: "bankName", label: "Bank Name" },
                            { id: "amount", label: "Amount" },
                            { id: "type", label: "Type" },
                            { id: "date", label: "Date" },
                            { id: "description", label: "Description" },
                        ]
                }
                onPrint={() => window.print()}
                onShare={() => console.log("Share clicked")}
                onSave={() => console.log("Save clicked")}
                onEdit={() => console.log("Edit clicked")}
            />
        </Box>
    );
}