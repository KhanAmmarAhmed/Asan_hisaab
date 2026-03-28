import React, { useContext, useMemo, useRef, useState } from "react";
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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import logo from "@/components/assets/logo.png";

const PURPLE = "#2E266D";

export default function LedgerPage() {
  const { income, expenses } = useContext(DataContext);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const ledgerRef = useRef(null);

  const dateRangeLabel = useMemo(() => {
    if (fromDate && toDate) return `${fromDate} to ${toDate}`;
    if (fromDate && !toDate) return `From ${fromDate}`;
    if (!fromDate && toDate) return `Up to ${toDate}`;
    return "All Dates";
  }, [fromDate, toDate]);

  const handlePrint = () => {
    document.body.classList.add("print-ledger");
    const cleanup = () => document.body.classList.remove("print-ledger");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  };

  const waitForImages = async (container) => {
    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }),
    );
  };

  const handleDownload = async () => {
    if (!ledgerRef.current || isDownloading) return;
    setIsDownloading(true);
    document.body.classList.add("print-ledger");
    try {
      await waitForImages(ledgerRef.current);
      const canvas = await html2canvas(ledgerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const dateStamp = new Date().toISOString().split("T")[0];
      pdf.save(`ledger-report-${dateStamp}.pdf`);
    } catch (error) {
      console.error("Failed to download ledger PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      document.body.classList.remove("print-ledger");
      setIsDownloading(false);
    }
  };

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
      .filter((i) => inDateRange(i.date))
      .map((i) => ({
        date: i.date,
        description: i.customerName || i.paymentMethod || "Income",
        reference: i.accountHead || "—",
        debit: 0,
        credit: parseAmount(i.amount),
        type: "income",
        voucher: i.voucher,
      }));

    const expenseEntries = expenses
      .filter((e) => inDateRange(e.date))
      .map((e) => ({
        date: e.date,
        description: e.customerName || e.paymentMethod || "Expense",
        reference: e.accountHead || "—",
        debit: parseAmount(e.amount),
        credit: 0,
        type: "expense",
        voucher: e.voucher,
      }));

    return [...incomeEntries, ...expenseEntries].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [income, expenses, fromDate, toDate]);

  // Running balance
  const ledgerWithBalance = useMemo(() => {
    let balance = 0;
    return ledgerEntries.map((entry) => {
      balance += entry.credit - entry.debit;
      return { ...entry, balance };
    });
  }, [ledgerEntries]);

  const totalCredits = ledgerEntries.reduce((s, e) => s + e.credit, 0);
  const totalDebits = ledgerEntries.reduce((s, e) => s + e.debit, 0);
  const netBalance = totalCredits - totalDebits;

  const hasData = ledgerEntries.length > 0;

  return (
    <Box ref={ledgerRef}>
      <Box
        className="ledger-print-only"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" style={{ height: 40, width: "auto" }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Ledger Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date Range: {dateRangeLabel}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Generated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <Typography
        className="ledger-print-hide"
        variant="h5"
        fontWeight={600}
        mb={2}
      >
        Ledger
      </Typography>

      {/* Filters */}
      <Box
        className="ledger-print-hide"
        display={{ md: "flex", xs: "block" }}
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
      >
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
            <Button
              size="small"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
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
              sx={{
                backgroundColor: PURPLE,
                height: 40,
                "&:hover": { backgroundColor: "#251b4f" },
              }}
              onClick={handlePrint}
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
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing..." : "Download"}
            </Button>
          </Box>
        )}
      </Box>

      {!hasData ? (
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: "center", borderRadius: 0.5 }}
        >
          <Typography color="text.secondary">
            No ledger entries found. Add Income or Expense transactions to view
            here.
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
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: "error.main" }}
                >
                  Debit
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  Credit
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledgerWithBalance.map((entry, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {entry.description}
                      </Typography>
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
                    {entry.debit > 0
                      ? `Rs. ${Number(entry.debit).toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "success.main" }}>
                    {entry.credit > 0
                      ? `Rs. ${Number(entry.credit).toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      color: entry.balance >= 0 ? "success.main" : "error.main",
                    }}
                  >
                    Rs. {Number(entry.balance).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}

              {/* Totals row */}
              <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                  Totals
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: "error.main" }}
                >
                  Rs. {totalDebits.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  Rs. {totalCredits.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: netBalance >= 0 ? "success.main" : "error.main",
                  }}
                >
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
