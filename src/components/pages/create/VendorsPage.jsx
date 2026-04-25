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
import { addVendorApi, updateVendorApi } from "@/services/vendorApi";

const tableColumns = [
  { id: "venderName", label: "Vender Name", width: "20%" },
  { id: "phone", label: "Phone Number", width: "20%" },
  { id: "email", label: "Email", width: "20%" },
  { id: "address", label: "Address", width: "25%" },
  { id: "action", label: "Action", width: "15%" },
];

export default function VendersPage() {
  const { vendors, addVendor, updateVendor } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingVendor, setEditingVendor] = useState(null);

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
      setEditingVendor(null);
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

    return vendors.filter((vender) => {
      const venderDate =
        (String(vender.date || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";
      return (
        (searchNameNorm === "" ||
          (vender.venderName || "").toLowerCase().includes(searchNameNorm)) &&
        (searchEmailNorm === "" ||
          (vender.email || "").toLowerCase().includes(searchEmailNorm)) &&
        (searchDateNorm === "" || venderDate === searchDateNorm)
      );
    });
  }, [vendors, searchName, searchEmail, searchDate]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingVendor(null);
    setIsModalOpen(true);
    setApiError("");
  };

  const handleOpenEditModal = (vendor) => {
    setModalMode("edit");
    setEditingVendor(vendor);
    setIsModalOpen(true);
    setApiError("");
  };

  const tableDataWithActions = useMemo(() => {
    return filteredData.map((vendor) => ({
      ...vendor,
      action: (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(vendor);
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
        const response = await addVendorApi(formData);
        const created = Array.isArray(response) ? response[0] : response;

        const newEntry = {
          venderName:
            created?.venderName || created?.name || formData.venderName || "",
          phone: created?.phone || created?.number || formData.phone || "",
          email: created?.email || formData.email || "",
          address:
            created?.address || created?.Address || formData.address || "",
          date: String(
            created?.created_at || created?.date || new Date().toISOString(),
          )
            .split("T")[0]
            .split(" ")[0],
          id:
            created?.id ??
            created?.vendor_id ??
            created?.vender_id ??
            created?.vendorId,
        };

        addVendor(newEntry);
      } else {
        const response = await updateVendorApi({
          ...formData,
          id: editingVendor.id,
        });
        const updated = Array.isArray(response) ? response[0] : response;

        const updatedVendor = {
          ...editingVendor,
          venderName:
            updated?.venderName || updated?.name || formData.venderName || "",
          phone: updated?.phone || updated?.number || formData.phone || "",
          email: updated?.email || formData.email || "",
          address:
            updated?.address || updated?.Address || formData.address || "",
        };
        updateVendor(updatedVendor);
      }
      setIsModalOpen(false);
    } catch (err) {
      setApiError(err.message || `Failed to ${modalMode} vendor`);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Create/Venders
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
            label="Vender Name"
            value={searchNameDraft}
            onChange={(e) => setSearchNameDraft(e?.target?.value ?? e)}
            options={makeOptions(vendors.map((c) => c.venderName))}
          />

          <GenericSelectField
            label="Email Address"
            value={searchEmailDraft}
            onChange={(e) => setSearchEmailDraft(e?.target?.value ?? e)}
            options={makeOptions(vendors.map((c) => c.email))}
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
        emptyMessage="No Vendors found"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalMode === "add" ? "Create Vender" : "Edit Vender"}
        mode={modalMode}
        selectedRow={editingVendor}
        columns={2}
        onSubmit={handleModalSubmit}
        fields={[
          { id: "venderName", label: "Vender Name" },
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
