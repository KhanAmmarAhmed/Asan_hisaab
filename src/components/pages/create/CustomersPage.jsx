import { useState, useContext, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, FilterList, Edit } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import GenericDateField from "@/components/generic/GenericDateField";
import { useTheme, useMediaQuery, Collapse } from "@mui/material";
import { DataContext } from "@/context/DataContext";
import { addCustomerApi, updateCustomerApi } from "@/services/customerApi";

const tableColumns = [
  { id: "customerName", label: "Customer Name", width: "20%" },
  { id: "phone", label: "Phone Number", width: "20%" },
  { id: "email", label: "Email", width: "20%" },
  { id: "address", label: "Address", width: "25%" },
  { id: "action", label: "Action", width: "15%" },
];

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Draft values (edited in UI)
  const [searchNameDraft, setSearchNameDraft] = useState("");
  const [searchEmailDraft, setSearchEmailDraft] = useState("");
  const [searchDateDraft, setSearchDateDraft] = useState("");

  // Applied values (used to filter table)
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Close modal when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setApiError("");
      setEditingCustomer(null);
    };
  }, []);

  // Helper to create options in the shape { label, value }
  const makeOptions = (arr) =>
    Array.from(new Set(arr.filter(Boolean))).map((v) => ({
      label: v,
      value: v,
    }));

  const filteredData = useMemo(() => {
    const searchNameNorm = String(searchName || "")
      .toLowerCase()
      .trim();
    const searchEmailNorm = String(searchEmail || "")
      .toLowerCase()
      .trim();
    const searchDateNorm =
      (String(searchDate || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";

    return customers.filter((customer) => {
      const customerName = (customer.customerName || "").toLowerCase();
      const customerEmail = (customer.email || "").toLowerCase();
      const customerDate =
        (String(customer.date || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";
      return (
        (searchNameNorm === "" || customerName.includes(searchNameNorm)) &&
        (searchEmailNorm === "" || customerEmail.includes(searchEmailNorm)) &&
        (searchDateNorm === "" || customerDate === searchDateNorm)
      );
    });
  }, [customers, searchName, searchEmail, searchDate]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingCustomer(null);
    setIsModalOpen(true);
    setApiError("");
  };

  const handleOpenEditModal = (customer) => {
    setModalMode("edit");
    setEditingCustomer(customer);
    setIsModalOpen(true);
    setApiError("");
  };

  const tableDataWithActions = useMemo(() => {
    return filteredData.map((customer) => ({
      ...customer,
      action: (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(customer);
            }}
            sx={{ minWidth: "40px", padding: "4px" }}
          >
            <Edit fontSize="small" />
          </Button>
        </Box>
      ),
    }));
  }, [filteredData]);

  const applyFilters = () => {
    setSearchName(searchNameDraft);
    setSearchEmail(searchEmailDraft);
    setSearchDate(searchDateDraft);
  };

  const handleModalSubmit = async (formData) => {
    setApiLoading(true);
    setApiError("");
    try {
      if (modalMode === "add") {
        const response = await addCustomerApi(formData);
        const created = Array.isArray(response) ? response[0] : response;

        const newCustomer = {
          customerName:
            created?.customerName || created?.name || formData.customerName,
          phone: created?.phone || created?.number || formData.phone,
          email: created?.email || formData.email,
          address: created?.address || created?.Address || formData.address,
          date: new Date().toISOString().split("T")[0],
          id: created?.id ?? created?.customer_id ?? created?.customerId,
        };
        addCustomer(newCustomer);
      } else {
        const response = await updateCustomerApi({
          ...formData,
          id: editingCustomer.id,
        });
        const updated = Array.isArray(response) ? response[0] : response;

        const updatedCustomer = {
          ...editingCustomer,
          customerName:
            updated?.customerName || updated?.name || formData.customerName,
          phone: updated?.phone || updated?.number || formData.phone,
          email: updated?.email || formData.email,
          address: updated?.address || updated?.Address || formData.address,
        };
        updateCustomer(updatedCustomer);
      }
      setIsModalOpen(false);
    } catch (err) {
      setApiError(err.message || `Failed to ${modalMode} customer`);
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
          onClick={handleOpenAddModal}
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
            value={searchNameDraft}
            onChange={(e) => setSearchNameDraft(e?.target?.value ?? e)}
            options={makeOptions(customers.map((c) => c.customerName))}
          />

          <GenericSelectField
            label="Email Address"
            value={searchEmailDraft}
            onChange={(e) => setSearchEmailDraft(e?.target?.value ?? e)}
            options={makeOptions(customers.map((c) => c.email))}
          />

          <GenericDateField
            value={searchDateDraft}
            onChange={(valOrEvent) =>
              setSearchDateDraft(valOrEvent?.target?.value ?? valOrEvent ?? "")
            }
          />

          <Button
            variant="contained"
            onClick={applyFilters}
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
        data={tableDataWithActions}
        emptyMessage="No Customers found"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === "add" ? "Create Customer" : "Edit Customer"}
        mode={modalMode}
        selectedRow={editingCustomer}
        onSubmit={handleModalSubmit}
        fields={[
          { id: "customerName", label: "Customer Name" },
          { id: "phone", label: "Phone Number" },
          { id: "email", label: "Email" },
          { id: "address", label: "Address" },
        ]}
        loading={apiLoading}
        error={apiError}
      />
    </Box>
  );
}
