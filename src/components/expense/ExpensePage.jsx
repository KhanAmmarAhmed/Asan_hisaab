import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useMemo } from "react";
import { Button, Collapse, useTheme, useMediaQuery } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";

const tableColumns = [
  { id: "voucher", label: "Voucher#", width: "10%" },
  { id: "customerName", label: "Customer Name", width: "18%" },
  { id: "accountHead", label: "Account Head", width: "16%" },
  { id: "paymentMethod", label: "Payment Method", width: "16%" },
  { id: "date", label: "Date", width: "14%" },
  { id: "status", label: "Status", width: "12%" },
  { id: "amount", label: "Amount", width: "14%" },
];
const paymentOptions = [
  "Cash",
  "Bank",
  "Cheque",
  "Online Transfer",
  "Credit Card",
  "Debit Card",
];

const ExpensePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const STORAGE_KEY = "expenseTableData";
  const [incomeData, setIncomeData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });

  const [showFilters, setShowFilters] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [accountHead, setAccountHead] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddIncome = (formData) => {
    const newVoucher = String(incomeData.length + 1).padStart(2, "0");

    const newEntry = {
      voucher: newVoucher,
      customerName: formData.customerName || "",
      accountHead: formData.accountHead || "",
      paymentMethod: formData.paymentMethod || "",
      date: new Date().toLocaleDateString(),
      status: "Invoiced",
      amount: `Rs. ${formData.amount || 0}`,
    };

    setIncomeData((prev) => [newEntry, ...prev]);
  };
  const filteredData = useMemo(() => {
    return incomeData.filter((item) => {
      return (
        (customerName === "" ||
          (item.customerName || "")
            .toLowerCase()
            .includes(customerName.toLowerCase())) &&
        (accountHead === "" ||
          (item.accountHead || "")
            .toLowerCase()
            .includes(accountHead.toLowerCase())) &&
        (searchDate === "" ||
          new Date(item.date).toISOString().split("T")[0] === searchDate)
      );
    });
  }, [incomeData, customerName, accountHead, searchDate]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalMode("detail-actions");
    setIsModalOpen(true);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incomeData));
  }, [incomeData]);

  return (
    <Box className="space-y-4">
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<FilterList />}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
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
      <Collapse in={showFilters}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 0.5fr",
            },
            gap: 2,
            width: "100%",
            mt: 2,
            p: isMobile ? 2 : 0,
            backgroundColor: isMobile ? "#f9f9f9" : "transparent",
            borderRadius: isMobile ? 1 : 0,
          }}
        >
          <GenericSelectField
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            options={[
              ...new Set(incomeData.map((item) => item.customerName)),
            ].map((name) => ({
              label: name,
              value: name,
            }))}
          />
          <GenericSelectField
            label="Account Head"
            value={accountHead}
            onChange={(e) => setAccountHead(e.target.value)}
            options={[
              ...new Set(incomeData.map((item) => item.accountHead)),
            ].map((name) => ({
              label: name,
              value: name,
            }))}
          />
          <GenericDateField
            value={searchDate}
            onChange={(valOrEvent) =>
              setSearchDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
            }
          />

          <Button
            variant="contained"
            sx={{
              borderRadius: 0.5,
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" },
            }}
          >
            Search
          </Button>
        </Box>
      </Collapse>

      <GenericTable
        columns={tableColumns}
        data={filteredData}
        emptyMessage="No income entries found"
        onRowClick={handleRowClick}
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === "add" ? "Add Expense Detail" : "Expense Detail"}
        mode={modalMode}
        columns={2}
        showAddFileButton={modalMode === "add"}
        selectedRow={selectedRow}
        onSubmit={handleAddIncome} // ✅ ADD THIS
        fields={
          modalMode === "add"
            ? [
                { id: "customerName", label: "Customer Name" },
                { id: "accountHead", label: "Account Head" },
                {
                  id: "paymentMethod",
                  label: "Payment Method",
                  placeHolder: "Select payment method",
                  type: "select",
                  options: paymentOptions,
                },
                { id: "amount", label: "Amount" },
                {
                  id: "description",
                  label: "Description",
                  type: "textarea",
                  rows: 2,
                },
              ]
            : [
                { id: "customerName", label: "Customer Name" },
                { id: "accountHead", label: "Account Head" },
                { id: "paymentMethod", label: "Payment Method" },
                { id: "date", label: "Date" },
              ]
        }
        onPrint={() => window.print()}
        onShare={() => console.log("Share clicked")}
        onSave={() => console.log("Save clicked")}
        onEdit={() => console.log("Edit clicked")}
      />
    </Box>
  );
};

export default ExpensePage;
