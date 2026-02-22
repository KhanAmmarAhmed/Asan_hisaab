import { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Typography, IconButton, Collapse, useTheme, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, FilterList, Edit } from "@mui/icons-material";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [projects, setProjects] = useState([
    { name: "Friends It Solutions", type: "FIS - IT Company" },
    { name: "BSB", type: "FIS - IT Company" },
    { name: "Business Solutions", type: "FIS - IT Company" },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    console.log("Search filter:", searchName);
    // Implement search logic here, e.g., filter projects array
  };

  const handleCreateOrEditProject = (formData) => {
    if (editingProjectIndex !== null) {
      // Edit existing project
      setProjects((prev) =>
        prev.map((proj, idx) =>
          idx === editingProjectIndex
            ? { ...proj, name: formData.projectName }
            : proj
        )
      );
    } else {
      // Create new project
      setProjects((prev) => [
        ...prev,
        { name: formData.projectName, type: "FIS - IT Company" },
      ]);
    }
    setEditingProjectIndex(null);
  };

  const handleEdit = (index) => {
    setEditingProjectIndex(index);
    setIsModalOpen(true);
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Create/Projects
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
          onClick={() => {
            setEditingProjectIndex(null);
            setIsModalOpen(true);
          }}
          sx={{
            backgroundColor: "#1B0D3F",
            "&:hover": { backgroundColor: "#2D1B69" }
          }}
        >
          Add
        </Button>
      </Box>

      {/* Filters */}
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
            label="Project Name"
            value={searchName}
            onChange={(e) => setSearchName(e?.target?.value ?? e)}
            options={projects.map((proj) => ({ label: proj.name, value: proj.name }))}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              borderRadius: 0.5,
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" }
            }}
          >
            Search
          </Button>
        </Box>
      </Collapse>

      {/* Project Cards */}
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          {projects.map((project, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.type}
                </Typography>
              </Box>
              <IconButton onClick={() => handleEdit(index)}>
                <Edit sx={{ color: "#1B0D3F" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Modal */}
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingProjectIndex !== null ? "Edit Project" : "Create Project"}
        mode="add"
        onSubmit={handleCreateOrEditProject}
        fields={[
          {
            id: "projectName",
            label: "Project Name",
            defaultValue: editingProjectIndex !== null ? projects[editingProjectIndex]?.name : "",
          },
        ]}
      />
    </Box>
  );
};

export default ProjectsPage;
