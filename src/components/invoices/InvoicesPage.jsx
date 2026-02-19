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
    status: "unPaid",
  },
];

const tableColumns = [
  { id: "voucher", label: "Voucher#", width: "5%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "ammount", label: "Ammount", width: "13%" },
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
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reference, setReference] = useState("");
  const [type, setType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddInvoices = (formData) => {
    const newVoucher = String(invoiceData.length + 1).padStart(2, "0");

    const newEntry = {
      voucher: newVoucher,
      type: formData.type || "",
      ammount: formData.ammount || "",
      entityType: formData.entityType || "",
      entity: formData.entity || "",
      date: new Date().toISOString().split("T")[0],
      reference: formData.reference || "",
      taxAble: formData.taxAble || "",
      madeBy: formData.madeBy || "",
      action: (
        <IconButton
          onClick={() => {
            setSelectedRow(newEntry);
            setIsModalOpen(true);
            console.log("View details for:", newEntry);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    };

    setInvoiceData((prev) => [newEntry, ...prev]);
  };
  const filteredData = useMemo(() => {
    return invoiceData.filter((item) => {
      return (
        (selectedStatus === "All" || item.status === selectedStatus) &&
        (reference === "" ||
          (item.reference || "")
            .toLowerCase()
            .includes(reference.toLowerCase())) &&
        (type === "" ||
          (item.type || "").toLowerCase().includes(type.toLowerCase())) &&
        (entityType === "" ||
          (item.entityType || "")
            .toLowerCase()
            .includes(entityType.toLowerCase())) &&
        (searchDate === "" ||
          new Date(item.date).toISOString().split("T")[0] === searchDate)
      );
    });
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
          onClick={() => setIsModalOpen(true)}
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
            display: "flex",
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
              (val) => ({
                label: val,
                value: val,
              }),
            )}
          />
          <GenericSelectField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[...new Set(invoiceData.map((i) => i.type))].map(
              (val) => ({
                label: val,
                value: val,
              }),
            )}
          />

          <GenericSelectField
            label="Entity Type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={[...new Set(invoiceData.map((i) => i.entityType))].map(
              (val) => ({
                label: val,
                value: val,
              }),
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
      />
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Invoice Detail"
        mode="form"
        columns={2}
        showAddFileButton
        onSubmit={handleAddInvoices} // ✅ ADD THIS
        fields={[
          { id: "type", label: "Type" },
          { id: "ammount", label: "Ammount" },
          { id: "entityType", label: "Entity Type" },
          { id: "entity", label: "Entity" },
          { id: "date", label: "Date" },
          { id: "reference", label: "Reference" },
          { id: "taxAble", label: "Taxable" },
          { id: "madeBy", label: "Made By" },
        ]}
      />
    </Box>
  );
}
