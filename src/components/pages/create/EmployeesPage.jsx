
import { useState } from "react";
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

const initialData = [
    {
        employeeName: "Muhammad Usman",
        phone: "03048973476",
        email: "usman123@gmail.com",
        address: "Rawalpindi",
        date: "2024-01-10",
    },
    {
        employeeName: "Ehtesham Ali",
        phone: "03157629450",
        email: "ehteshamali@gmail.com",
        address: "Mianwali",
        date: "2024-01-15",
    },
];

const tableColumns = [
    { id: "employeeName", label: "Employee Name", width: "25%" },
    { id: "phone", label: "Phone Number", width: "25%" },
    { id: "email", label: "Email", width: "25%" },
    { id: "address", label: "Address", width: "25%" },
];

export default function EmployeesPage() {
    const [employees, setEmployees] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Helper to create options in the shape { label, value }
    const makeOptions = (arr) =>
        Array.from(new Set(arr.filter(Boolean))).map((v) => ({ label: v, value: v }));

    const handleSearch = () => {
        const filtered = employees.filter((employee) => {
            return (
                (searchName === "" ||
                    (employee.employeeName || "")
                        .toLowerCase()
                        .includes(searchName.toLowerCase())) &&
                (searchEmail === "" ||
                    (employee.email || "")
                        .toLowerCase()
                        .includes(searchEmail.toLowerCase())) &&
                (searchDate === "" || employee.date === searchDate)
            );
        });

        setFilteredData(filtered);
    };

    const handleCreateEmployee = (formData) => {
        const newEntry = {
            employeeName: formData.employeeName || "",
            phone: formData.phone || "",
            email: formData.email || "",
            address: formData.address || "",
            date: new Date().toISOString().split("T")[0],
        };

        const updated = [newEntry, ...employees];
        setEmployees(updated);
        // If filters active, you might want to re-run the current filter; we'll show updated list
        setFilteredData(updated);
        setIsModalOpen(false);
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
                        value={searchName}
                        onChange={(e) => setSearchName(e?.target?.value ?? e)}
                        options={makeOptions(employees.map((c) => c.employeeName))}
                    />

                    <GenericSelectField
                        label="Email Address"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e?.target?.value ?? e)}
                        options={makeOptions(employees.map((c) => c.email))}
                    />

                    <GenericDateField
                        value={searchDate}
                        onChange={(valOrEvent) =>
                            setSearchDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
                        }
                    />

                    <Button
                        variant="contained"
                        onClick={handleSearch}
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
                onOpenChange={setIsModalOpen}
                title="Create Employee"
                mode="add"
                columns={2}
                onSubmit={handleCreateEmployee}
                fields={[
                    { id: "employeeName", label: "Employee Name" },
                    { id: "phone", label: "Phone Number" },
                    { id: "email", label: "Email" },
                    { id: "address", label: "Address" },
                ]}
            />
        </Box>
    );
}
