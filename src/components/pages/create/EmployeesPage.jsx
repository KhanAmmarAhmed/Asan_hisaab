import { useContext, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, Delete, Edit, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import FormModal from "@/components/generic/FormModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";
import {
  addEmployeeApi,
  deleteEmployeeApi,
  updateEmployeeApi,
} from "@/services/employeeApi";
import { fetchDepartmentsApi } from "@/services/departmentApi";
import { fetchDesignationsApi } from "@/services/designationApi";
import { mapEmployeeToRow } from "@/utils/employeeUtils";

const makeOptions = (values) =>
  Array.from(new Set(values.filter(Boolean))).map((value) => ({
    label: value,
    value,
  }));

const EmployeesPage = () => {
  const {
    employees,
    employeesLoading,
    employeesError,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchNameDraft, setSearchNameDraft] = useState("");
  const [searchEmailDraft, setSearchEmailDraft] = useState("");
  const [searchDateDraft, setSearchDateDraft] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const departmentOptions = useMemo(() => {
    return departments
      .filter((department) => department?.department_name)
      .map((department) => ({
        label: department.department_name,
        value: department.id,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [departments]);

  const filteredDesignations = useMemo(() => {
    if (!selectedDepartment) return designations;

    return designations.filter((designation) => {
      const designationDepartmentId =
        designation?.department_id ||
        designation?.dept_id ||
        designation?.departmentId;

      return String(designationDepartmentId) === String(selectedDepartment);
    });
  }, [designations, selectedDepartment]);

  const designationOptions = useMemo(() => {
    return filteredDesignations
      .filter((designation) => designation?.designation_name)
      .map((designation) => ({
        label: designation.designation_name,
        value: designation.id,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [filteredDesignations]);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [departmentList, designationList] = await Promise.all([
          fetchDepartmentsApi(),
          fetchDesignationsApi(),
        ]);

        setDepartments(Array.isArray(departmentList) ? departmentList : []);
        setDesignations(Array.isArray(designationList) ? designationList : []);
      } catch (error) {
        console.warn("Failed to load employee form dependencies:", error);
        setDepartments([]);
        setDesignations([]);
      }
    };

    loadDependencies();
  }, []);

  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setApiError("");
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalizedName = String(searchName || "")
      .toLowerCase()
      .trim();
    const normalizedEmail = String(searchEmail || "")
      .toLowerCase()
      .trim();
    const normalizedDate =
      (String(searchDate || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";

    return employees.filter((employee) => {
      const employeeDate =
        (String(employee.date || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";

      return (
        (!normalizedName ||
          employee.employeeName.toLowerCase().includes(normalizedName)) &&
        (!normalizedEmail ||
          employee.email.toLowerCase().includes(normalizedEmail)) &&
        (!normalizedDate || employeeDate === normalizedDate)
      );
    });
  }, [employees, searchName, searchEmail, searchDate]);

  const applyFilters = () => {
    setSearchName(searchNameDraft);
    setSearchEmail(searchEmailDraft);
    setSearchDate(searchDateDraft);
  };

  const buildEmployeeFallback = ({
    employeeId,
    formData,
    departmentId,
    designationId,
    departmentName,
    designationName,
    createdAt,
  }) => ({
    id: employeeId,
    employeeName: formData.employeeName,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    department: departmentName,
    designation: designationName,
    department_id: departmentId,
    designation_id: designationId,
    created_at: createdAt,
  });

  const handleCreateEmployee = async (formData) => {
    setApiLoading(true);
    setApiError("");

    try {
      if (!formData.department) throw new Error("Department is required");
      if (!formData.designation) throw new Error("Designation is required");

      const departmentId = formData.department;
      const designationId = formData.designation;
      const departmentRecord = departments.find((item) => item.id == departmentId);
      const designationRecord = designations.find(
        (item) => item.id == designationId,
      );

      const response = await addEmployeeApi({
        employeeName: formData.employeeName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        department_id: departmentId,
        designation_id: designationId,
      });

      const employeeRow = mapEmployeeToRow(
        response,
        buildEmployeeFallback({
          employeeId: response?.id,
          formData,
          departmentId,
          designationId,
          departmentName: departmentRecord?.department_name || "",
          designationName: designationRecord?.designation_name || "",
          createdAt: response?.created_at || new Date().toISOString(),
        }),
      );

      addEmployee(employeeRow);
      setIsModalOpen(false);
      setSelectedDepartment("");
    } catch (error) {
      setApiError(error.message || "Failed to create employee");
    } finally {
      setApiLoading(false);
    }
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setSelectedDepartment(employee?.department_id || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (formData) => {
    setApiLoading(true);
    setApiError("");

    try {
      if (!formData.department) throw new Error("Department is required");
      if (!formData.designation) throw new Error("Designation is required");

      const departmentId = formData.department;
      const designationId = formData.designation;
      const departmentRecord = departments.find((item) => item.id == departmentId);
      const designationRecord = designations.find(
        (item) => item.id == designationId,
      );

      const response = await updateEmployeeApi({
        id: editingEmployee?.id,
        employeeName: formData.employeeName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        department_id: departmentId,
        designation_id: designationId,
      });

      const employeeRow = mapEmployeeToRow(
        response,
        buildEmployeeFallback({
          employeeId: response?.id || editingEmployee?.id,
          formData,
          departmentId,
          designationId,
          departmentName: departmentRecord?.department_name || "",
          designationName: designationRecord?.designation_name || "",
          createdAt: editingEmployee?.date,
        }),
      );

      updateEmployee(employeeRow);
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      setSelectedDepartment("");
    } catch (error) {
      setApiError(error.message || "Failed to update employee");
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setDeleteLoading(employeeId);
    setApiError("");

    try {
      await deleteEmployeeApi(employeeId);
      deleteEmployee(employeeId);
    } catch (error) {
      setApiError(error.message || "Failed to delete employee");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleModalChange = (fieldId, value, setFormData) => {
    if (fieldId === "department") {
      setSelectedDepartment(value);
      setFormData((previousValue) => ({
        ...previousValue,
        department: value,
        designation: "",
      }));
      return;
    }

    setFormData((previousValue) => ({
      ...previousValue,
      [fieldId]: value,
    }));
  };

  const tableColumns = [
    { id: "employeeName", label: "Name", width: "15%" },
    { id: "email", label: "Email", width: "18%" },
    { id: "phone", label: "Phone", width: "12%" },
    { id: "address", label: "Address", width: "15%" },
    { id: "department", label: "Department", width: "12%" },
    { id: "designation", label: "Designation", width: "12%" },
    { id: "date", label: "Created At", width: "12%" },
    {
      id: "action",
      label: "Action",
      width: "8%",
      sortable: false,
      render: (employee) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleOpenEditModal(employee)}
            disabled={deleteLoading === employee.id || apiLoading}
            sx={{ minWidth: "40px", padding: "4px" }}
          >
            <Edit fontSize="small" />
          </Button>

        </Box>
      ),
    },
  ];

  return (
    <Box className="space-y-4">
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Employees
      </Typography>

      {employeesError && !apiError && <Alert severity="error">{employeesError}</Alert>}

      {apiError && (
        <Alert severity="error" onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<FilterList />}
          onClick={() => setShowFilters((previousValue) => !previousValue)}
        >
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setApiError("");
            setIsModalOpen(true);
          }}
          sx={{
            backgroundColor: "#1B0D3F",
            "&:hover": { backgroundColor: "#2D1B69" },
          }}
        >
          Add Employee
        </Button>
      </Box>

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
            label="Employee Name"
            value={searchNameDraft}
            onChange={(event) => setSearchNameDraft(event?.target?.value ?? event)}
            options={makeOptions(employees.map((employee) => employee.employeeName))}
          />

          <GenericSelectField
            label="Email Address"
            value={searchEmailDraft}
            onChange={(event) => setSearchEmailDraft(event?.target?.value ?? event)}
            options={makeOptions(employees.map((employee) => employee.email))}
          />

          <GenericDateField
            value={searchDateDraft}
            onChange={(valueOrEvent) =>
              setSearchDateDraft(
                valueOrEvent?.target?.value ?? valueOrEvent ?? "",
              )
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

      {employeesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <GenericTable
          columns={tableColumns}
          data={filteredEmployees}
          emptyMessage="No employees found"
        />
      )}

      <FormModal
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            setSelectedDepartment("");
          }
        }}
        title="Add Employee"
        mode="add"
        onSubmit={handleCreateEmployee}
        onCustomChange={handleModalChange}
        fields={[
          { id: "employeeName", label: "Employee Name", required: true },
          { id: "phone", label: "Phone Number", required: true },
          { id: "email", label: "Email", required: true },
          { id: "address", label: "Address", required: true },
          {
            id: "department",
            label: "Department",
            type: "select",
            placeholder: "Select department",
            options: departmentOptions,
            required: true,
          },
          {
            id: "designation",
            label: "Designation",
            type: "select",
            placeholder: "Select designation",
            options: designationOptions,
            required: true,
          },
        ]}
        loading={apiLoading}
        error={apiError}
      />

      <FormModal
        open={isEditModalOpen}
        onOpenChange={(isOpen) => {
          setIsEditModalOpen(isOpen);
          if (!isOpen) {
            setEditingEmployee(null);
            setSelectedDepartment("");
          }
        }}
        title="Edit Employee"
        mode="edit"
        onSubmit={handleUpdateEmployee}
        onCustomChange={handleModalChange}
        selectedRow={
          editingEmployee
            ? {
              employeeName: editingEmployee.employeeName,
              phone: editingEmployee.phone,
              email: editingEmployee.email,
              address: editingEmployee.address,
              department: editingEmployee.department_id || selectedDepartment,
              designation: editingEmployee.designation_id || "",
            }
            : null
        }
        fields={[
          { id: "employeeName", label: "Employee Name", required: true },
          { id: "phone", label: "Phone Number", required: true },
          { id: "email", label: "Email", required: true },
          { id: "address", label: "Address", required: true },
          {
            id: "department",
            label: "Department",
            type: "select",
            placeholder: "Select department",
            options: departmentOptions,
            required: true,
          },
          {
            id: "designation",
            label: "Designation",
            type: "select",
            placeholder: "Select designation",
            options: designationOptions,
            required: true,
          },
        ]}
        loading={apiLoading}
        error={apiError}
      />
    </Box>
  );
};

export default EmployeesPage;
