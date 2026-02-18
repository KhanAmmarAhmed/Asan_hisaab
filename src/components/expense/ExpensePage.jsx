import { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericFilterButton from "@/components/generic/GenericFilterButton";
import GenericModal from "@/components/generic/GenericModal";

const initialData = [
  {
    voucher: "01",
    customerName: "Mr. Adnan Tariq",
    accountHead: "Munem Habib",
    paymentMethod: "Bank",
    date: "2/24/2023",
    status: "Invoiced",
    amount: "Rs. 40,000",
  },
  {
    voucher: "02",
    customerName: "Mr. Adnan Tariq",
    accountHead: "Habib Ullah",
    paymentMethod: "Cash",
    date: "3/24/2023",
    status: "Invoiced",
    amount: "Rs. 10,000",
  },
];

const tableColumns = [
  { id: "voucher", label: "Voucher#", width: "10%" },
  { id: "customerName", label: "Customer Name", width: "18%" },
  { id: "accountHead", label: "Account Head", width: "16%" },
  { id: "paymentMethod", label: "Payment Method", width: "16%" },
  { id: "date", label: "Date", width: "14%" },
  { id: "status", label: "Status", width: "12%" },
  { id: "amount", label: "Amount", width: "14%" },
];

const filterOptions = ["All", "Invoiced", "Paid", "Pending", "Overdue"];
const ExpensePage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeData, setIncomeData] = useState(initialData);

  const filteredData =
    selectedFilter === "All"
      ? incomeData
      : incomeData.filter((row) => row.status === selectedFilter);

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
  return (
    <Box className="space-y-4">
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
        onSubmit={handleAddIncome} // ✅ ADD THIS
        fields={[
          { id: "customerName", label: "Customer Name" },
          { id: "accountHead", label: "Account Head" },
          { id: "paymentMethod", label: "Payment Method" },
          { id: "amount", label: "Amount" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            rows: 4,
          },
        ]}
      />
    </Box>
  );
};

export default ExpensePage;
