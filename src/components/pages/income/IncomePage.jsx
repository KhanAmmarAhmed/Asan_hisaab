import { useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import { Button, Collapse, useTheme, useMediaQuery } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";

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

export default function IncomePage() {
  const { income, addIncome, customers } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [accountHead, setAccountHead] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddIncome = (formData) => {
    const newVoucher = String(income.length + 1).padStart(2, "0");

    const newEntry = {
      voucher: newVoucher,
      customerName: formData.customerName || "",
      accountHead: formData.accountHead || "",
      paymentMethod: formData.paymentMethod || "",
      date: new Date().toISOString().split("T")[0],
      status: "Invoiced",
      amount: Number(formData.amount || 0),
    };

    addIncome(newEntry);
    setIsModalOpen(false);
  };
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };
  const filteredData = useMemo(() => {
    return income.filter((item) => {
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
  }, [income, customerName, accountHead, searchDate]);

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
              ...new Set([
                ...income.map((item) => item.customerName),
                ...customers.map((c) => c.customerName)
              ])
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
              ...new Set(income.map((item) => item.accountHead)),
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
        data={filteredData.map(item => ({
          ...item,
          amount: formatCurrency(item.amount)
        }))}
        emptyMessage="No income entries found"
        onRowClick={(row) => {
          setSelectedRow(row);
          setModalMode("detail-actions");
          setIsModalOpen(true);
        }}
      />
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === "add" ? "Add Income Detail" : "Income Detail"}
        mode={modalMode}
        columns={2}
        showAddFileButton={modalMode === "add"}
        selectedRow={selectedRow}
        onSubmit={handleAddIncome}
        fields={
          modalMode === "add"
            ? [
              { id: "customerName", label: "Customer Name", type: "select", options: customers.map(c => c.customerName) },
              { id: "accountHead", label: "Account Head" },
              {
                id: "paymentMethod",
                label: "Payment Method",
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
}
