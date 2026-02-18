import { useState } from "react";
import Box from "@mui/material/Box";
import { Button, IconButton } from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericFilterButton from "@/components/generic/GenericFilterButton";
import GenericModal from "@/components/generic/GenericModal";
import BalanceCards from "@/components/dashboard/BalanceCards";
import VisibilityIcon from "@mui/icons-material/Visibility";
const initialData = [];

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

const filterOptions = ["All", "Invoiced", "Paid", "Pending", "Overdue"];

export default function InvoicesPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeData, setIncomeData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredData =
    selectedFilter === "All"
      ? incomeData
      : incomeData.filter((row) => row.status === selectedFilter);

  const handleAddInvoices = (formData) => {
    const newVoucher = String(incomeData.length + 0).padStart(1, "0");

    const newEntry = {
      voucher: newVoucher,
      type: formData.type || "",
      ammount: formData.ammount || "",
      entityType: formData.entityType || "",
      entity: formData.entity || "",
      date: new Date().toLocaleDateString(),
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

    setIncomeData((prev) => [newEntry, ...prev]);
  };

  return (
    <Box className="space-y-4">
      <Box>
        <BalanceCards />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <GenericFilterButton
          options={filterOptions}
          selectedOption={selectedFilter}
          onOptionChange={setSelectedFilter}
          label="Filter"
        />
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
      <GenericTable
        columns={tableColumns}
        data={filteredData}
        emptyMessage="No income entries found"
      />
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Income Detail"
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
