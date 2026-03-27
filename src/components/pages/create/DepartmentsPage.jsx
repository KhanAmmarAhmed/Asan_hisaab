import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { Plus } from "lucide-react";
import GenericModal from "../../generic/GenericModal";

const DepartmentsPage = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const departmentFields = [
    {
      id: "departmentName",
      label: "Department Name",
      type: "text",
      placeholder: "Enter department name",
      required: true,
    },
  ];
  const handleAddDepartment = (formData) => {
    const newDepartment = {
      id: Date.now(),
      name: formData.departmentName,
    };

    setDepartments((prev) => [...prev, newDepartment]);
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="space-y-4">
        {/* Closing Balance Section */}

        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Create/Employees
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
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

        <Box className="space-y-2">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-3 bg-white shadow rounded-lg border"
            >
              {dept.name}
            </div>
          ))}
        </Box>

        {/* Add Account Modal */}
        <GenericModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          fields={departmentFields}
          onSubmit={handleAddDepartment}
          title="Add Department"
          submitButtonLabel="Add"
          loading={apiLoading}
          error={apiError}
        />
      </div>
    </>
  );
};

export default DepartmentsPage;
