import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Plus, Edit2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import FormModal from "../../generic/FormModal";
import {
  addDepartmentApi,
  fetchDepartmentsApi,
  deleteDepartmentApi,
  updateDepartmentApi,
} from "../../../services/departmentApi";

const DepartmentsPage = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const location = useLocation();

  // Memoize fields to prevent GenericModal from reinitializing on every render
  const departmentFields = useMemo(
    () => [
      {
        id: "departmentName",
        label: "Department Name",
        type: "text",
        placeholder: "Enter department name",
        required: true,
      },
    ],
    [],
  );

  // Close modals when user navigates away from this page
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setEditingDepartment(null);
      setApiError("");
    };
  }, []);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsFetching(true);
      setApiError("");
      const data = await fetchDepartmentsApi();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load departments";
      setApiError(errorMessage);
      console.error("Error loading departments:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddDepartment = async (formData) => {
    try {
      setApiLoading(true);
      setApiError("");
      await addDepartmentApi({
        departmentName: formData.departmentName,
        status: "1",
      });
      await loadDepartments();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add department";
      setApiError(errorMessage);
      console.error("Error adding department:", error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }
    try {
      setDeleteLoading(departmentId);
      setApiError("");
      await deleteDepartmentApi(departmentId);
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete department";
      setApiError(errorMessage);
      console.error("Error deleting department:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (department) => {
    const transformedDepartment = {
      ...department,
      departmentName: department.department_name || "",
    };
    setEditingDepartment(transformedDepartment);
    setIsEditModalOpen(true);
  };

  const handleSaveEditDepartment = async (formData) => {
    try {
      setApiLoading(true);
      setApiError("");
      await updateDepartmentApi({
        id: editingDepartment.id,
        departmentName: formData.departmentName,
        status: editingDepartment.status || "1",
      });
      await loadDepartments();
      setIsEditModalOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update department";
      setApiError(errorMessage);
      console.error("Error updating department:", error);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Section */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Departments
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenAddModal}
            sx={{
              backgroundColor: "#1f0f46",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 0.5,
              textTransform: "none",
              gap: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#2d1b69",
              },
            }}
          >
            <Plus size={18} />
            Add
          </Button>
        </Box>

        {/* Error Alert */}
        {apiError && (
          <Alert severity="error" onClose={() => setApiError("")}>
            {apiError}
          </Alert>
        )}

        {/* Loading State */}
        {isFetching ? (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress />
          </Box>
        ) : departments.length === 0 ? (
          <Box
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
            sx={{ color: "#757575", fontStyle: "italic" }}
          >
            No departments found. Click "Add" to create one.
          </Box>
        ) : (
          <Box className="space-y-2">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-3 bg-white shadow rounded-lg border flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {dept.department_name || "N/A"}
                  </Typography>
                  {dept.status && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: dept.status === "1" ? "#4caf50" : "#f44336",
                      }}
                    >
                      {dept.status === "1" ? "Active" : "Inactive"}
                    </Typography>
                  )}
                </div>
                <Box className="flex gap-2">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleOpenEditModal(dept)}
                    sx={{
                      color: "#1976d2",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                      minWidth: "auto",
                    }}
                  >
                    <Edit2 size={18} />
                  </Button>
                  {/* <Button
                    variant="text"
                    size="small"
                    onClick={() => handleDeleteDepartment(dept.id)}
                    disabled={deleteLoading === dept.id}
                    sx={{
                      color: "#d32f2f",
                      "&:hover": { backgroundColor: "#ffebee" },
                      minWidth: "auto",
                    }}
                  >
                    <Trash2 size={18} />
                  </Button> */}
                </Box>
              </div>
            ))}
          </Box>
        )}

        {/* Add Department Modal */}
        <FormModal
          open={isModalOpen}
          onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) setApiError("");
          }}
          fields={departmentFields}
          onSubmit={handleAddDepartment}
          title="Add Department"
          submitButtonLabel="Add"
          loading={apiLoading}
          error={apiError}
        />

        {/* Edit Department Modal */}
        <FormModal
          open={isEditModalOpen}
          onOpenChange={(isOpen) => {
            setIsEditModalOpen(isOpen);
            if (!isOpen) {
              setEditingDepartment(null);
              setApiError("");
            }
          }}
          mode="edit"
          selectedRow={editingDepartment}
          fields={departmentFields}
          onSubmit={handleSaveEditDepartment}
          title="Edit Department"
          submitButtonLabel="Update"
          loading={apiLoading}
          error={apiError}
        />
      </div>
    </>
  );
};

export default DepartmentsPage;
