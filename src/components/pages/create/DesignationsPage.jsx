import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Plus, Trash2, Edit2 } from "lucide-react";
import GenericModal from "../../generic/GenericModal";

// 👉 Fixed API function names (correct casing)
import {
  addDesignationApi,
  fetchDesignationsApi,
  deleteDesignationApi,
  updateDesignationApi,
} from "../../../services/designationApi";
import { fetchDepartmentsApi } from "../../../services/departmentApi";

const DesignationsPage = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingDesignation, setEditingDesignation] = useState(null);

  // ✅ Memoize fields to update when departments change
  const addDesignationFields = useMemo(
    () => [
      {
        id: "departmentId",
        label: "Department",
        type: "select",
        placeholder: "Select department",
        required: true,
        options: (departments || []).map((dept) => ({
          value: dept.id,
          label: dept.department_name || "N/A",
        })),
      },
      {
        id: "designationName",
        label: "Designation Name",
        type: "text",
        placeholder: "Enter designation name",
        required: true,
      },
    ],
    [departments],
  );

  // ✅ Fields for editing designation (with department)
  const editDesignationFields = useMemo(
    () => [
      {
        id: "departmentId",
        label: "Department",
        type: "select",
        placeholder: "Select department",
        required: true,
        options: (departments || []).map((dept) => ({
          value: dept.id,
          label: dept.departments_name || dept.name || "N/A",
        })),
      },
      {
        id: "designationName",
        label: "Designation Name",
        type: "text",
        placeholder: "Enter designation name",
        required: true,
      },
    ],
    [departments],
  );

  useEffect(() => {
    loadDepartments();
    loadDesignations();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartmentsApi();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading departments:", error);
      setDepartments([]);
    }
  };

  const loadDesignations = async () => {
    try {
      setIsFetching(true);
      setApiError("");
      const data = await fetchDesignationsApi();
      setDesignations(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load designations";
      setApiError(errorMessage);
      console.error("Error loading designations:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddDesignation = async (formData) => {
    try {
      setApiLoading(true);
      setApiError("");

      await addDesignationApi({
        departmentId: formData.departmentId,
        designationName: formData.designationName,
        status: "1",
      });

      await loadDesignations();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add designation";
      setApiError(errorMessage);
      console.error("Error adding designation:", error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteDesignation = async (id) => {
    if (!window.confirm("Delete this designation?")) return;

    try {
      setDeleteLoading(id);
      setApiError("");

      await deleteDesignationApi(id);

      setDesignations((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete designation";
      setApiError(errorMessage);
      console.error("Error deleting designation:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleOpenEditModal = (designation) => {
    setEditingDesignation(designation);
    setIsEditModalOpen(true);
  };

  const handleSaveEditDesignation = async (formData) => {
    try {
      setApiLoading(true);
      setApiError("");

      await updateDesignationApi({
        id: editingDesignation.id,
        departmentId: formData.departmentId,
        designationName: formData.designationName,
        status: editingDesignation.status || "1",
      });

      await loadDesignations();
      setIsEditModalOpen(false);
      setEditingDesignation(null);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update designation";
      setApiError(errorMessage);
      console.error("Error updating designation:", error);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Designations
        </Typography>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: "#1f0f46",
            "&:hover": { backgroundColor: "#2d1b69" },
          }}
        >
          Add
        </Button>
      </Box>

      {/* Error Alert */}
      {apiError && (
        <Alert severity="error" onClose={() => setApiError("")} sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {/* Loading */}
      {isFetching ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : designations.length === 0 ? (
        <Typography color="text.secondary">No designations found.</Typography>
      ) : (
        <Box className="space-y-2">
          {designations.map((d) => (
            <Box
              key={d.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              border="1px solid #ddd"
              borderRadius={1}
              mb={1}
              sx={{
                backgroundColor: "#fff",
                "&:hover": { boxShadow: 1 },
              }}
            >
              <Box flex={1}>
                <Typography variant="body2" fontWeight={600}>
                  {d.designation || d.designation_name || "N/A"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Dept ID: {d.department_id || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Button
                  size="small"
                  onClick={() => handleOpenEditModal(d)}
                  sx={{ color: "#1976d2" }}
                >
                  <Edit2 size={18} />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Add Modal */}
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        fields={addDesignationFields}
        onSubmit={handleAddDesignation}
        title="Add Designation"
        submitButtonLabel="Add"
        loading={apiLoading}
        error={apiError}
      />

      {/* Edit Modal */}
      <GenericModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        fields={editDesignationFields}
        onSubmit={handleSaveEditDesignation}
        title="Edit Designation"
        submitButtonLabel="Update"
        loading={apiLoading}
        error={apiError}
        initialValues={
          editingDesignation
            ? {
                departmentId: editingDesignation.department_id,
                designationName:
                  editingDesignation.designation ||
                  editingDesignation.designation_name ||
                  "",
              }
            : {}
        }
      />
    </Box>
  );
};

export default DesignationsPage;
