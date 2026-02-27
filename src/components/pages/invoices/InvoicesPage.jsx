import { useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericFilterButton from "@/components/generic/GenericFilterButton";
import GenericModal from "@/components/generic/GenericModal";
import BalanceCards from "@/components/dashboard/BalanceCards";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";

const tableColumns = [
  { id: "voucher", label: "Voucher#", width: "5%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "ammount", label: "Amount", width: "13%" },
  { id: "entityType", label: "Entity Type", width: "10%" },
  { id: "entity", label: "Entity", width: "10%" },
  { id: "date", label: "Date", width: "10%" },
  { id: "reference", label: "Reference", width: "10%" },
  { id: "taxAble", label: "Taxable", width: "10%" },
  { id: "madeBy", label: "Made By", width: "10%" },
  { id: "action", label: "Action", width: "7%" },
];

const statusOptions = ["All", "Invoiced", "Paid", "Pending"];

export default function InvoicesPage() {
  const {
    invoices,
    addInvoice,
    customers,
    vendors,
    totalPaidInvoices,
    totalPendingInvoices,
  } = useContext(DataContext);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reference, setReference] = useState("");
  const [type, setType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [modalMode, setModalMode] = useState("add"); // "add" | "selection" | "detail-actions" | "receivable-step1" | "receivable-step2"
  const [selectedType, setSelectedType] = useState(""); // Store selected type from Green/Red buttons
  const [receivableData, setReceivableData] = useState({
    customer: "",
    dueDate: "",
    amount: "",
    discount: "",
    reference: "",
    grandTotal: "",
  });
  const [payableData, setPayableData] = useState({
    vendor: "",
    dueDate: "",
    amount: "",
    discount: "",
    reference: "",
    grandTotal: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddInvoices = (formData) => {
    const newVoucher = String(invoices.length + 1).padStart(2, "0");
    const newEntry = {
      voucher: newVoucher,
      type: selectedType || formData.type || "",
      ammount: Number(formData.ammount || 0),
      entityType: formData.entityType || "",
      entity: formData.entity || "",
      date: new Date().toISOString().split("T")[0],
      reference: formData.reference || "",
      taxAble: formData.taxAble || "",
      madeBy: formData.madeBy || "",
      status: "Pending",
    };
    addInvoice(newEntry);
    setIsModalOpen(false);
    resetReceivableData();
  };

  const resetPayableData = () => {
    setPayableData({
      customer: "",
      dueDate: "",
      amount: "",
      description: "",
      reference: "",
      taxAble: "",
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type === "Receivable") {
      setModalMode("receivable-step1");
    } else if (type === "Payable") {
      setModalMode("payable-step1");
    } else {
      // setModalMode("add");
      console.log("unable to open modal for type:", type);
    }
    console.log("Selected type issssss:", type);
  };

  const handleReceivableStep1Submit = (data) => {
    setReceivableData((prev) => ({
      ...prev,
      customer: data.customer,
      dueDate: data.dueDate,
    }));
    setModalMode("receivable-step2");
  };

  const handlePayableStep1Submit = (data) => {
    setPayableData((prev) => ({
      ...prev,
      vendor: data.vendor,
      dueDate: data.dueDate,
    }));
    setModalMode("payable-step2");
  };

  const handleReceivableStep2Submit = (data) => {
    const newVoucher = String(invoices.length + 1).padStart(2, "0");
    const customerObj = customers.find(
      (c) => c.customerName === receivableData.customer,
    );

    const newEntry = {
      voucher: newVoucher,
      type: "Receivable",
      ammount: Number(data.amount || 0),
      entityType: "Customer",
      entity: receivableData.customer,
      date: receivableData.dueDate,
      reference: data.reference || "",
      taxAble: data.taxAble || "",
      madeBy: "Current User",
      status: "Pending",
      description: data.description || "",
    };

    addInvoice(newEntry);
    console.log("Receivable invoice created:", newEntry);

    setIsModalOpen(false);
    setModalMode("selection");
    resetReceivableData();
  };

  const handlePayableStep2Submit = (data) => {
    const newVoucher = String(invoices.length + 1).padStart(2, "0");
    const vendorObj = vendors.find((v) => v.vendorName === payableData.vendor);

    const newEntry = {
      voucher: newVoucher,
      type: "Payable",
      ammount: Number(data.amount || 0),
      entityType: "Vendor",
      entity: payableData.vendor,
      date: payableData.dueDate,
      reference: data.reference || "",
      taxAble: data.taxAble || "",
      madeBy: "Current User",
      status: "Pending",
      description: data.description || "",
    };

    addInvoice(newEntry);
    console.log("Payable invoice created:", newEntry);

    setIsModalOpen(false);
    setModalMode("selection");
    resetPayableData();
  };

  const handleBackToStep1 = () => {
    setModalMode("receivable-step1");
  };

  const filteredData = useMemo(() => {
    return invoices
      .filter((item) => {
        return (
          (selectedStatus === "All" || item.status === selectedStatus) &&
          (reference === "" ||
            item.reference?.toLowerCase().includes(reference.toLowerCase())) &&
          (type === "" ||
            item.type?.toLowerCase().includes(type.toLowerCase())) &&
          (entityType === "" ||
            item.entityType
              ?.toLowerCase()
              .includes(entityType.toLowerCase())) &&
          (searchDate === "" ||
            new Date(item.date).toISOString().split("T")[0] === searchDate)
        );
      })
      .map((item) => ({
        ...item,
        ammount: formatCurrency(item.ammount),
        action: (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(item);
              setModalMode("detail-actions");
              setIsModalOpen(true);
            }}
            size="small"
            title="View Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ),
      }));
  }, [invoices, selectedStatus, reference, type, entityType, searchDate]);

  return (
    <Box className="space-y-4">
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        <BalanceCards
          title="Paid Amount"
          amount={formatCurrency(totalPaidInvoices)}
        />
        <BalanceCards
          title="Pending Amount"
          amount={formatCurrency(totalPendingInvoices)}
        />
      </Box>

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
            setModalMode("selection");
            setSelectedRow(null);
            setIsModalOpen(true);
          }}
          sx={{
            bgcolor: "#1B0D3F",
            color: "#FFFFFF",
            fontWeight: 600,
            "&:hover": { bgcolor: "#2D1B69" },
          }}
        >
          Add Invoice
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "0.5fr 0.5fr 0.5fr 0.5fr 0.5fr",
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
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            options={[...new Set(invoices.map((i) => i.reference))].map(
              (val) => ({ label: val, value: val }),
            )}
          />
          <GenericSelectField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[...new Set(invoices.map((i) => i.type))].map((val) => ({
              label: val,
              value: val,
            }))}
          />
          <GenericSelectField
            label="Entity Type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={[...new Set(invoices.map((i) => i.entityType))].map(
              (val) => ({ label: val, value: val }),
            )}
          />
          <GenericDateField
            value={searchDate}
            onChange={(valOrEvent) =>
              setSearchDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
            }
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#1B0D3F", "&:hover": { bgcolor: "#2D1B69" } }}
          >
            Search
          </Button>
        </Box>
      </Collapse>

      <Box>
        <GenericFilterButton
          options={statusOptions}
          selectedOption={selectedStatus}
          onOptionChange={setSelectedStatus}
          label="Status"
        />
      </Box>

      <GenericTable
        columns={tableColumns}
        data={filteredData}
        emptyMessage="No income entries found"
        onRowClick={(row) => {
          setSelectedRow(row);
          setModalMode("transaction-detail-actions");
          setIsModalOpen(true);
        }}
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          modalMode === "selection"
            ? "Generate Invoice"
            : modalMode === "receivable-step1"
              ? "Receivable Invoice - Step 1"
              : modalMode === "receivable-step2"
                ? "Receivable Invoice - Step 2"
                : modalMode === "payable-step1"
                  ? "Payable Invoice - Step 1"
                  : modalMode === "payable-step2"
                    ? "Payable Invoice - Step 2"
                    : "Transaction Details"
        }
        mode={modalMode}
        fields={[
          { id: "type", label: "Type" },
          { id: "ammount", label: "Amount" },
          { id: "entityType", label: "Entity Type" },
          { id: "entity", label: "Entity" },
        ]}
        selectedRow={selectedRow}
        onSubmit={
          modalMode === "selection"
            ? handleTypeSelect
            : modalMode === "receivable-step1"
              ? handleReceivableStep1Submit
              : modalMode === "receivable-step2"
                ? handleReceivableStep2Submit
                : modalMode === "payable-step1"
                  ? handlePayableStep1Submit
                  : modalMode === "payable-step2"
                    ? handlePayableStep2Submit
                    : handleAddInvoices
        }
        submitButtonLabel={
          modalMode === "receivable-step1" || modalMode === "payable-step1"
            ? "Next"
            : modalMode === "receivable-step2" || modalMode === "payable-step2"
              ? "Create Invoice"
              : "Save Invoice"
        }
        onPrint={() => window.print()}
        onShare={() => console.log("Share clicked")}
        onSave={() => console.log("Save clicked")}
        onEdit={() => console.log("Edit clicked")}
        customers={customers}
        vendors={vendors} // Add this
        receivableData={receivableData}
        payableData={payableData}
        onBack={
          modalMode === "receivable-step2" || modalMode === "payable-step2"
            ? handleBackToStep1
            : null
        }
      />
    </Box>
  );
}
