import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Typography,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Add, FilterList, Edit } from "@mui/icons-material";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import { DataContext } from "@/context/DataContext";

const ProjectsPage = () => {
  const { projects, addProject, updateProject } = useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreateOrEditProject = (formData) => {
    const name = formData.projectName?.trim();
    const alias = formData.projectAlias?.trim();
    const type = formData.projectType?.trim();

    // 🚨 Prevent empty values
    if (!name || !alias || !type) {
      return;
    }

    const projectData = {
      name,
      alias,
      type: `${alias} - ${type}`,
    };

    if (editingProjectIndex !== null) {
      updateProject(editingProjectIndex, projectData);
    } else {
      addProject(projectData);
    }

    setEditingProjectIndex(null);
    setIsModalOpen(false);
  };

  const handleEdit = (originalIndex) => {
    setEditingProjectIndex(originalIndex);
    setIsModalOpen(true);
  };

  const filteredProjects = projects
    .map((project, index) => ({ ...project, originalIndex: index }))
    .filter((proj) =>
      proj.name?.toLowerCase().includes(searchName.toLowerCase()),
    );

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
            options={projects.map((proj) => ({
              label: proj.name,
              value: proj.name,
            }))}
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

      {/* Project Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        {filteredProjects.map((project) => (
          <Box
            key={project.originalIndex}
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

            <IconButton onClick={() => handleEdit(project.originalIndex)}>
              <Edit sx={{ color: "#1B0D3F" }} />
            </IconButton>
          </Box>
        ))}
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
            defaultValue:
              editingProjectIndex !== null
                ? projects[editingProjectIndex]?.name
                : "",
          },
          {
            id: "projectAlias",
            label: "Project Alias",
            defaultValue:
              editingProjectIndex !== null
                ? projects[editingProjectIndex]?.alias
                : "",
          },
          {
            id: "projectType",
            label: "Project Type",
            defaultValue:
              editingProjectIndex !== null
                ? projects[editingProjectIndex]?.type
                : "",
          },
        ]}
      />
    </Box>
  );
};

export default ProjectsPage;
