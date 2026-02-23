import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  Paper,
  Chip,
  Stack,
  MenuItem,
} from "@mui/material";
import logo from "../assets/asanLogo.png";
import {
  Close,
  AttachFile,
  Print,
  Share,
  Save,
  Edit,
  CloudUpload,
  Delete,
  InsertDriveFile,
} from "@mui/icons-material";
import GenericTable from "./GenericTable";
// import GenericSelectField from "./GenericSelectField";

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "#4CAF50";
    case "pending":
      return "#FF9800";
    case "invoiced":
      return "#2196F3";
    default:
      return "#9E9E9E";
  }
};

export default function GenericModal({
  open,
  onOpenChange,
  title,
  mode = "add", // "add" | "form" | "view" | "detail" | "detail-actions" | "selection"
  fields = [],
  selectedRow = null,
  onSubmit,
  submitButtonLabel = "Save",
  onPrint,
  onShare,
  onSave,
  onEdit,
  showDescription = false,
  showFileUpload = false,
}) {
  const [formData, setFormData] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  // Pre-populate form data when editing
  useEffect(() => {
    if (selectedRow && (mode === "add" || mode === "form")) {
      const initialData = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        } else if (selectedRow[field.id]) {
          initialData[field.id] = selectedRow[field.id];
        }
      });
      setFormData(initialData);
    }
    // Clear file when modal opens/closes or row changes
    if (!open) {
      setSelectedFile(null);
      setDragActive(false);
    }
  }, [selectedRow, mode, fields, open]);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // --- Drag and Drop Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    // Include file in formData if present
    const finalData = { ...formData };
    if (selectedFile) {
      finalData.file = selectedFile;
    }

    if (onSubmit) onSubmit(finalData);
    setFormData({});
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({});
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={mode.includes("detail") ? "md" : "sm"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0.5,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* ========== HEADER ========== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          bgcolor: mode === "add" || mode === "form" ? "#FFFFFF" : "#F8F7FC",
        }}
      >
        <DialogTitle
          sx={{ p: 0, fontWeight: 700, color: "#1B0D3F", fontSize: "1.2rem" }}
        >
          {title}
        </DialogTitle>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <DialogContent sx={{ px: 3, py: 1 }}>
        {/* ========== ADD/FORM MODE ========== */}
        {(mode === "add" || mode === "form") && (
          <>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.id}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
                  >
                    {field.label}
                  </Typography>
                  <TextField
                    fullWidth
                    select={field.type === "select"}
                    multiline={field.type === "textarea"}
                    rows={field.rows || 1}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.id] || field.defaultValue || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        bgcolor: "#F9F9F9",
                      },
                    }}
                  >
                    {field.type === "select" &&
                      field.options &&
                      field.options.map((option) => (
                        <MenuItem
                          key={option.value || option}
                          value={option.value || option}
                        >
                          {option.label || option}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              ))}
            </Grid>

            {/* Drag and Drop File Upload */}
            <Box sx={{ mt: 1 }}>
              {showDescription &&
                !fields.find((f) => f.id === "description") && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
                    >
                      Payment Description
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Enter payment description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          bgcolor: "#F9F9F9",
                        },
                      }}
                    />
                  </Box>
                )}
              {/* {showDescription &&
                !fields.find((f) => f.id === "description") && ( */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
                >
                  Add File
                </Typography>

                <Box
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={!selectedFile ? onButtonClick : undefined}
                  sx={{
                    border: `2px dashed ${dragActive ? "#1B0D3F" : "#BDBDBD"}`,
                    borderRadius: 0.5,
                    bgcolor: dragActive ? "#F0ECF9" : "#F9F9F9",
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "120px",
                    "&:hover": {
                      borderColor: "#1B0D3F",
                      bgcolor: "#F5F5F5",
                    },
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  {!selectedFile ? (
                    <>
                      <CloudUpload
                        sx={{ fontSize: 40, color: "#9E9E9E", mb: 1 }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        <Box component="span" fontWeight="bold" color="#1B0D3F">
                          Click to upload
                        </Box>{" "}
                        or drag and drop
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        SVG, PNG, JPG or GIF (max. 5MB)
                      </Typography>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        justifyContent: "space-between",
                        px: 2,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: "#E3E0E8",
                            p: 1,
                            borderRadius: 0.5,
                            display: "flex",
                          }}
                        >
                          <InsertDriveFile sx={{ color: "#1B0D3F" }} />
                        </Box>
                        <Box textAlign="left">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="#1B0D3F"
                            noWrap
                          >
                            {selectedFile.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        onClick={removeFile}
                        sx={{
                          color: "#D32F2F",
                          "&:hover": { bgcolor: "#FFEBEE" },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
              {/* )} */}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                }}
              >
                {submitButtonLabel}
              </Button>
            </Box>
          </>
        )}

        {/* ========== VIEW MODE ========== */}
        {mode === "view" && selectedRow && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E0E0E0",
              borderRadius: 0.5,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "#F5F5F5",
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "#F44336", fontWeight: 600 }}>
                  FIS-{selectedRow.voucher?.padStart(7, "0")}
                </Typography>
                <Chip
                  label={selectedRow.status || "N/A"}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(selectedRow.status),
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#2E7D32",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  mt: 1,
                }}
              >
                {selectedRow.amount || selectedRow.ammount || "0"}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {fields.map((field, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  <Typography fontWeight={600}>{field.label}:</Typography>
                  <Typography color="#555">
                    {selectedRow[field.id] || "N/A"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* ========== DETAIL VIEW ========== */}
        {(mode === "detail" || mode === "detail-actions") && selectedRow && (
          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ color: "#F44336", fontWeight: 600, fontSize: "0.9rem" }}
              >
                FIS-{selectedRow.voucher?.padStart(7, "0") || "0000000"}
              </Typography>
              <Typography
                sx={{ color: "#2E7D32", fontWeight: 700, fontSize: "1rem" }}
              >
                {selectedRow.amount || selectedRow.ammount || "Rs. 0"}
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E0E0E0",
                borderRadius: 0.5,
                p: 2,
                mb: 3,
              }}
            >
              <Grid container spacing={2}>
                {fields.map((field) => (
                  <Grid item xs={6} key={field.id}>
                    <Typography color="#666" variant="body2">
                      {field.label}
                    </Typography>
                    <Typography fontWeight={600}>
                      {selectedRow[field.id] || "N/A"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 0.5,
                  p: 2,
                  mb: 1,
                  mt: 2,
                }}
              >
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Payment Description:
                </Typography>
                <Typography color="#555">
                  {selectedRow.description ||
                    "Smart money management with Assan Hissab mobile app that helps you control your finances"}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{ border: "1px solid #E0E0E0", borderRadius: 0.5, p: 2 }}
              >
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Attachment
                </Typography>
                {selectedRow.file || selectedRow.attachment ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InsertDriveFile sx={{ color: "#1B0D3F" }} />
                    <Typography
                      color="#1B0D3F"
                      sx={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {selectedRow.file?.name ||
                        selectedRow.attachment ||
                        "View Attachment"}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="#999" fontStyle="italic">
                    No Attachment Available
                  </Typography>
                )}
              </Paper>
            </Paper>

            {mode === "detail-actions" && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid #E0E0E0",
                  pt: 2,
                  gap: 2,
                }}
              >
                {[
                  {
                    icon: <Print />,
                    label: "Print",
                    onClick: onPrint || (() => window.print()),
                  },
                  {
                    icon: <Share />,
                    label: "Share",
                    onClick: onShare || (() => console.log("Share")),
                  },
                  {
                    icon: <Save />,
                    label: "Save",
                    onClick: onSave || (() => console.log("Save")),
                  },
                  {
                    icon: <Edit />,
                    label: "Edit",
                    onClick: onEdit || (() => console.log("Edit")),
                  },
                ].map((action, idx) => (
                  <Stack
                    key={idx}
                    alignItems="center"
                    sx={{ cursor: "pointer", color: "#1B0D3F" }}
                    onClick={action.onClick}
                  >
                    <IconButton sx={{ color: "#1B0D3F" }}>
                      {action.icon}
                    </IconButton>
                    <Typography variant="caption" fontWeight={600}>
                      {action.label}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* ========== Transaction DETAIL ========== */}
        {(mode === "transaction-detail" ||
          mode === "transaction-detail-actions") &&
          selectedRow && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <img src={logo} alt="Logo" style={{ width: 100 }} />
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight={600} color="#555">
                    invoice#{selectedRow.voucher?.padStart(1, "0") || "0"}
                  </Typography>
                  <Typography variant="subtitle1" color="#1B0D3F">
                    {selectedRow.date
                      ? new Date(selectedRow.date).toLocaleDateString()
                      : "N/A"}
                    {/* {selectedRow.accountHead || "N/A"} */}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography mb={1} fontWeight={900}>
                  Attention:
                </Typography>
                <Typography fontWeight={600} color="#555">
                  Mohammad Adnan Tariq
                </Typography>
                <Typography fontWeight={600} color="#555">
                  Chacklala scheme 3, Rawalpindi
                </Typography>
                <Typography fontWeight={600} color="#555">
                  0304-7329166
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 0.5,
                  p: 2,
                  my: 2,
                }}
              >
                <GenericTable
                  columns={[
                    { id: "voucher", label: "Voucher#", width: "5%" },
                    { id: "type", label: "Type", width: "10%" },
                    { id: "ammount", label: "Amount", width: "13%" },
                    { id: "entityType", label: "Entity Type", width: "10%" },
                  ]}
                  data={selectedRow.items || selectedRow.lines || []}
                  emptyMessage="No income entries found"
                  onRowClick={(row) => console.log("row clicked", row)}
                />
              </Paper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                  mb: 3,
                }}
              >
                <Typography fontWeight={600} color="#555">
                  Sub Total: {selectedRow.ammount}/-
                </Typography>
                <Typography fontWeight={600} color="#555">
                  Discount: {selectedRow.discount || 0}/-
                </Typography>
                <Typography fontWeight={600} color="#555">
                  Tax(15%): Rs.0/-
                </Typography>
                <Typography fontWeight={600} color="#555">
                  Grand Total: /-
                </Typography>
              </Box>

              {mode === "transaction-detail-actions" && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    borderTop: "1px solid #E0E0E0",
                    pt: 2,
                    gap: 2,
                  }}
                >
                  {[
                    {
                      icon: <Print />,
                      label: "Print",
                      onClick: onPrint || (() => window.print()),
                    },
                    {
                      icon: <Share />,
                      label: "Share",
                      onClick: onShare || (() => console.log("Share")),
                    },
                    {
                      icon: <Save />,
                      label: "Save",
                      onClick: onSave || (() => console.log("Save")),
                    },
                    {
                      icon: <Edit />,
                      label: "Edit",
                      onClick: onEdit || (() => console.log("Edit")),
                    },
                  ].map((action, idx) => (
                    <Stack
                      key={idx}
                      alignItems="center"
                      sx={{ cursor: "pointer", color: "#1B0D3F" }}
                      onClick={action.onClick}
                    >
                      <IconButton sx={{ color: "#1B0D3F" }}>
                        {action.icon}
                      </IconButton>
                      <Typography variant="caption" fontWeight={600}>
                        {action.label}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              )}
            </Box>
          )}

        {/* ========== SELECTION MODE ========== */}
        {mode === "selection" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              py: 2,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => onSubmit && onSubmit("Sales Invoice")}
              sx={{
                bgcolor: "#2E7D32",
                color: "white",
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#1B5E20" },
              }}
            >
              Payable
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onSubmit && onSubmit("Purchase Invoice")}
              sx={{
                bgcolor: "#D32F2F",
                color: "white",
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#C62828" },
              }}
            >
              Receivable
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
