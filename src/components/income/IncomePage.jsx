import { useState } from "react";
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

export default function IncomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeData, setIncomeData] = useState(initialData);
  const [showFilters, setShowFilters] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [accountHead, setAccountHead] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const handleSearch = () => {
  //   const filtered = incomeData.filter((item) => {
  //     return (
  //       (customerName === "" ||
  //         (item.customerName || "")
  //           .toLowerCase()
  //           .includes(customerName.toLowerCase())) &&
  //       (accountHead === "" ||
  //         (item.accountHead || "")
  //           .toLowerCase()
  //           .includes(accountHead.toLowerCase())) &&
  //       (searchDate === "" || item.date === searchDate)
  //     );
  //   });

  //   setFilteredData(filtered);
  // };

  const handleAddIncome = (formData) => {
    const newVoucher = String(incomeData.length + 1).padStart(2, "0");

    const newEntry = {
      voucher: newVoucher,
      customerName: formData.customerName || "",
      accountHead: formData.accountHead || "",
      paymentMethod: formData.paymentMethod || "",
      date: new Date().toISOString().split("T")[0],
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
            rows: 2,
          },
        ]}
      />
    </Box>
  );
}
