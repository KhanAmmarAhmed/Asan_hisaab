

import { useState } from "react";
import Box from "@mui/material/Box";
import { useMemo } from "react";
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

const initialData = [
  {
    voucher: "01",
    type: "Sales Invoice",
    ammount: "Rs. 40,000",
    entityType: "Customer",
    entity: "Mr. Adnan Tariq",
    date: "2/24/2023",
    reference: "Ref-12345",
    taxAble: "Yes",
    madeBy: "Admin",
    status: "Paid",
  },
  {
    voucher: "02",
    type: "Purchase Invoice",
    ammount: "Rs. 10,000",
    entityType: "Supplier",
    entity: "Mr. Ali Khan",
    date: "3/24/2023",
    reference: "Ref-67890",
    taxAble: "No",
    madeBy: "Admin",
    status: "Pending",
  },
];

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
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reference, setReference] = useState("");
  const [type, setType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [modalMode, setModalMode] = useState("add"); // "add" | "selection" | "detail-actions"
  const [selectedType, setSelectedType] = useState(""); // Store selected type from Green/Red buttons

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddInvoices = (formData) => {
    const newVoucher = String(invoiceData.length + 1).padStart(2, "0");
    const newEntry = {
      voucher: newVoucher,
      type: selectedType || formData.type || "",
      ammount: formData.ammount || "",
      entityType: formData.entityType || "",
      entity: formData.entity || "",
      date: new Date().toISOString().split("T")[0],
      reference: formData.reference || "",
      taxAble: formData.taxAble || "",
      madeBy: formData.madeBy || "",
      status: "Pending",
    };
    setInvoiceData((prev) => [newEntry, ...prev]);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setModalMode("add");
  };

  const filteredData = useMemo(() => {
    return invoiceData
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
  }, [invoiceData, selectedStatus, reference, type, entityType, searchDate]);

  return (
    <Box className="space-y-4">
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        <BalanceCards title="Paid Amount" amount="Rs. 50,000" />
        <BalanceCards title="Pending Amount" amount="Rs. 25,000" />
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
            options={[...new Set(invoiceData.map((i) => i.reference))].map(
              (val) => ({ label: val, value: val }),
            )}
          />
          <GenericSelectField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[...new Set(invoiceData.map((i) => i.type))].map(
              (val) => ({ label: val, value: val }),
            )}
          />
          <GenericSelectField
            label="Entity Type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={[...new Set(invoiceData.map((i) => i.entityType))].map(
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
            ? "Select Invoice Type"
            : modalMode === "add"
              ? `Add ${selectedType || "Invoice"}`
              : "Transaction Detail"
        }
        mode={modalMode}
        fields={[
          { id: "type", label: "Type" },
          { id: "ammount", label: "Amount" },
          { id: "entityType", label: "Entity Type" },
          { id: "entity", label: "Entity" },
          { id: "reference", label: "Reference" },
          { id: "taxAble", label: "Taxable" },
          { id: "madeBy", label: "Made By" },
        ]}
        selectedRow={selectedRow}
        onSubmit={modalMode === "selection" ? handleTypeSelect : handleAddInvoices}
        submitButtonLabel="Save Invoice"
        onPrint={() => window.print()}
        onShare={() => console.log("Share clicked")}
        onSave={() => console.log("Save clicked")}
        onEdit={() => console.log("Edit clicked")}
      />
    </Box>
  );
}
