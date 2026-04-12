import { useState, useContext, useMemo, useEffect } from "react";
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
import { addEmployeeApi } from "@/services/employeeApi";
import { fetchDepartmentsApi } from "@/services/departmentApi";
import { fetchDesignationsApi } from "@/services/designationApi";

const tableColumns = [
  { id: "employeeName", label: "Employee Name", width: "25%" },
  { id: "phone", label: "Phone Number", width: "12%" },
  { id: "email", label: "Email", width: "25%" },
  { id: "address", label: "Address", width: "30%" },
  { id: "department", label: "Department", width: "21%" },
  { id: "designation", label: "Designation", width: "21%" },
];

export default function EmployeesPage() {
  const { employees, addEmployee } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

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

  // Helper to create options in the shape { label, value }
  const makeOptions = (arr) =>
    Array.from(new Set(arr.filter(Boolean))).map((v) => ({
      label: v,
      value: v,
    }));

  // Create a map from department names to IDs for filtering
  const departmentMap = useMemo(() => {
    const map = {};
    (departments || []).forEach((dept) => {
      const name = dept?.department_name || "";
      if (name) {
        map[name] = dept?.department_id || dept?.id;
      }
    });
    return map;
  }, [departments]);

  const departmentOptions = useMemo(() => {
    const names = (departments || [])
      .map((dept) => dept?.department_name || "")
      .filter(Boolean);
    return makeOptions(names).sort((a, b) => a.label.localeCompare(b.label));
  }, [departments]);

  // Filter designations based on selected department
  const filteredDesignations = useMemo(() => {
    if (!selectedDepartment) return designations;

    const selectedDeptId = departmentMap[selectedDepartment];
    if (!selectedDeptId) return [];

    return (designations || []).filter((des) => {
      const desDeptId = des?.department_id || des?.dept_id || des?.departmentId;
      return desDeptId == selectedDeptId; // Use loose equality to handle string/number comparison
    });
  }, [designations, selectedDepartment, departmentMap]);

  const designationOptions = useMemo(() => {
    const names = filteredDesignations
      .map((item) => item?.designation_name || "")
      .filter(Boolean);
    return makeOptions(names).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredDesignations]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartmentsApi();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn("Failed to load departments:", error);
        setDepartments([]);
      }
    };

    const loadDesignations = async () => {
      try {
        const data = await fetchDesignationsApi();
        setDesignations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn("Failed to load designations:", error);
        setDesignations([]);
      }
    };

    loadDepartments();
    loadDesignations();
  }, []);

  const filteredData = useMemo(() => {
    const searchNameNorm = String(searchName || "")
      .toLowerCase()
      .trim();
    const searchEmailNorm = String(searchEmail || "")
      .toLowerCase()
      .trim();
    const searchDateNorm =
      (String(searchDate || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";

    return employees.filter((employee) => {
      const employeeDate =
        (String(employee.date || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || "";

      return (
        (searchNameNorm === "" ||
          (employee.employeeName || "")
            .toLowerCase()
            .includes(searchNameNorm)) &&
        (searchEmailNorm === "" ||
          (employee.email || "").toLowerCase().includes(searchEmailNorm)) &&
        (searchDateNorm === "" || employeeDate === searchDateNorm)
      );
    });
  }, [employees, searchName, searchEmail, searchDate]);

  const applyFilters = () => {
    setSearchName(searchNameDraft);
    setSearchEmail(searchEmailDraft);
    setSearchDate(searchDateDraft);
  };

  const handleCreateEmployee = async (formData) => {
    setApiLoading(true);
    setApiError("");
    try {
      const response = await addEmployeeApi(formData);
      const created = Array.isArray(response) ? response[0] : response;

      const newEntry = {
        employeeName:
          created?.employeeName || created?.name || formData.employeeName || "",
        phone: created?.phone || created?.number || formData.phone || "",
        email: created?.email || formData.email || "",
        address: created?.address || created?.Address || formData.address || "",
        department: created?.department || formData.department || "",
        designation: created?.designation || formData.designation || "",
        date: String(
          created?.created_at || created?.date || new Date().toISOString(),
        )
          .split("T")[0]
          .split(" ")[0],
        id: created?.id ?? created?.employee_id ?? created?.employeeId,
      };

      addEmployee(newEntry);
      setIsModalOpen(false);
      setSelectedDepartment(""); // Reset on successful creation
    } catch (err) {
      setApiError(err.message || "Failed to create employee");
    } finally {
      setApiLoading(false);
    }
  };

  // Custom change handler to manage department and designation updates
  const handleModalChange = (fieldId, value, setFormData, formData) => {
    if (fieldId === "department") {
      // When department changes, update selected department and clear designation
      setSelectedDepartment(value);
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
        designation: "", // Clear designation when department changes
      }));
    } else {
      // For other fields, just update normally
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    }
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Create/Employees
      </Typography>

      {/* Top Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<FilterList />}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {/* show collapse icon when filters are open */}
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
            label="Employee Name"
            value={searchNameDraft}
            onChange={(e) => setSearchNameDraft(e?.target?.value ?? e)}
            options={makeOptions(employees.map((c) => c.employeeName))}
          />

          <GenericSelectField
            label="Email Address"
            value={searchEmailDraft}
            onChange={(e) => setSearchEmailDraft(e?.target?.value ?? e)}
            options={makeOptions(employees.map((c) => c.email))}
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
        data={filteredData}
        emptyMessage="No Employee found"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            setSelectedDepartment(""); // Reset when modal closes
          }
        }}
        title="Create Employee"
        mode="add"
        columns={2}
        onSubmit={handleCreateEmployee}
        onCustomChange={handleModalChange}
        fields={[
          { id: "employeeName", label: "Employee Name" },
          { id: "phone", label: "Phone Number" },
          { id: "email", label: "Email" },
          { id: "address", label: "Address" },
          {
            id: "department",
            label: "Department",
            type: "select",
            placeholder: "Select department",
            options: departmentOptions,
          },
          {
            id: "designation",
            label: "Designation",
            type: "select",
            placeholder: "Select designation",
            options: designationOptions,
          },
        ]}
        loading={apiLoading}
        error={apiError}
      />
    </Box>
  );
}
