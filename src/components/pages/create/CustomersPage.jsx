import { useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import GenericDateField from "@/components/generic/GenericDateField";
import { useTheme, useMediaQuery, Collapse } from "@mui/material";
import { DataContext } from "@/context/DataContext";
import { addCustomerApi } from "@/services/customerApi";

const tableColumns = [
  // { id: "voucherId", label: "voucher#", width: "5%" },
  { id: "customerName", label: "Customer Name", width: "25%" },
  { id: "phone", label: "Phone Number", width: "25%" },
  { id: "email", label: "Email", width: "25%" },
  { id: "address", label: "Address", width: "25%" },
];

export default function CustomersPage() {
  const { customers, addCustomer } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper to create options in the shape { label, value }
  const makeOptions = (arr) =>
    Array.from(new Set(arr.filter(Boolean))).map((v) => ({
      label: v,
      value: v,
    }));

  const filteredData = useMemo(() => {
    return customers.filter((customer) => {
      const customerName = (customer.customerName || "").toLowerCase();
      const customerEmail = (customer.email || "").toLowerCase();
      return (
        (searchName === "" ||
          customerName.includes(searchName.toLowerCase())) &&
        (searchEmail === "" ||
          customerEmail.includes(searchEmail.toLowerCase())) &&
        (searchDate === "" || customer.date === searchDate)
      );
    });
  }, [customers, searchName, searchEmail, searchDate]);

  const handleCreateCustomer = async (formData) => {
    setApiLoading(true);
    setApiError("");
    try {
      const response = await addCustomerApi(formData);
      const created = Array.isArray(response) ? response[0] : response;

      const newCustomer = {
        customerName:
          created?.customerName || created?.name || formData.customerName,
        phone: created?.phone || created?.number || formData.phone,
        email: created?.email || formData.email,
        address: created?.address || formData.address,
        date: new Date().toISOString().split("T")[0],
        id: created?.id ?? created?.customer_id ?? created?.customerId,
      };
      addCustomer(newCustomer);
      setIsModalOpen(false);
    } catch (err) {
      setApiError(err.message || "Failed to create customer");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Create/Customers
      </Typography>

      {/* Top Buttons */}
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
            "&:hover": { backgroundColor: "#2D1B69" },
          }}
        >
          Add
        </Button>
      </Box>

      {/* Filters */}
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
            value={searchName}
            onChange={(e) => setSearchName(e?.target?.value ?? e)}
            options={makeOptions(customers.map((c) => c.customerName))}
          />

          <GenericSelectField
            label="Email Address"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e?.target?.value ?? e)}
            options={makeOptions(customers.map((c) => c.email))}
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
        emptyMessage="No Customers found"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create Customer"
        mode="add"
        onSubmit={handleCreateCustomer}
        fields={[
          { id: "customerName", label: "Customer Name" },
          { id: "phone", label: "Phone Number" },
          { id: "email", label: "Email" },
          { id: "address", label: "Address" },
        ]}
        loading={apiLoading} // pass loading state
        error={apiError}
      />
    </Box>
  );
}
