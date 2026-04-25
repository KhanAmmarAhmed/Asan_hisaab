import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "@/context/AuthContext";
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
  // AttachFile,
  Print,
  Share,
  Save,
  Edit,
  CloudUpload,
  Delete,
  InsertDriveFile,
  ArrowBack,
  ContentCopy,
  Add,
} from "@mui/icons-material";
import GenericTable from "./GenericTable";
import GenericSelectField from "./GenericSelectField";
import GenericDateField from "./GenericDateField";
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
  mode = "add", // "add" | "edit" | "form" | "view" | "detail" | "detail-actions" | "selection" | "receivable-step1" | "receivable-step2"
  fields = [],
  selectedRow = null,
  onSubmit,
  submitButtonLabel = "Save",
  loading = false,
  error = "",
  onPrint,
  onShare,
  onSave,
  onEdit,
  onCopy,
  onPreview,
  onCustomChange,
  showDescription = false,
  showFileUpload = false,
  customers = [],
  receivableData = {},
  payableData = {},
  onBack,
  vendors = [],
  employees = [],
  onStepComplete,
}) {
  const [formData, setFormData] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: 1,
    price: 0,
  });
  console.log("🔍 Modal State:", receivableData);
  const { currentAccount, accounts } = useAuth();
  const inputRef = useRef(null);
  const handleAddItem = () => {
    if (!newItem.itemName) return;
    const items = formData.items || [];
    const total = newItem.quantity * newItem.price;
    const itemWithTotal = { ...newItem, total, id: Date.now() };

    // Console logging for debugging
    console.log("📝 Adding Item to Payable Invoice:", {
      itemName: newItem.itemName,
      quantity: newItem.quantity,
      price: newItem.price,
      total: total,
      itemId: itemWithTotal.id,
    });

    setFormData((prev) => ({
      ...prev,
      items: [...items, itemWithTotal],
    }));

    console.log("✅ Item added successfully! Total items:", items.length + 1);
    setNewItem({ itemName: "", quantity: 1, price: 0 });
  };

  const itemsTotal = (formData.items || []).reduce(
    (sum, item) => sum + (item.total || 0),
    0,
  );

  // Effect 1: Reset all form state when modal closes
  // Only depends on `open` — this prevents `fields` reference changes from
  // triggering the reset branch and causing an infinite re-render loop.
  useEffect(() => {
    if (!open) {
      setFormData((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      setSelectedFile(null);
      setDragActive(false);
      setHasInitialized(false);
      setFileError("");
    }
  }, [open]);

  // Effect 2: Initialize form data when modal opens (runs once per open)
  useEffect(() => {
    if (!open || hasInitialized) return;

    if (selectedRow && (mode === "add" || mode === "form" || mode === "edit")) {
      const initialData = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        } else if (selectedRow[field.id]) {
          initialData[field.id] = selectedRow[field.id];
        }
      });
      setFormData(initialData);
      setHasInitialized(true);
      return;
    }

    if (mode === "payable-step1") {
      setFormData({
        entity: payableData?.entityName || "",
        dueDate: payableData?.dueDate || "",
      });
      setHasInitialized(true);
      return;
    }

    if (mode === "payable-step1.5") {
      setFormData((prev) => ({
        ...prev,
        entity: payableData?.entityName || "",
        dueDate: payableData?.dueDate || "",
        items: payableData?.items || [],
      }));
      setHasInitialized(true);
      return;
    }

    if (mode === "payable-step2") {
      setFormData({
        items: payableData?.items || [],
        amount:
          (payableData?.items || []).reduce(
            (sum, item) => sum + (item.total || 0),
            0,
          ) || 0,
        discount: payableData?.discount || 0,
        subTotal: payableData?.subTotal || 0,
        taxAble: payableData?.taxAble || "No",
        grandTotal: payableData?.grandTotal || 0,
        reference: payableData?.reference || "",
      });
      setHasInitialized(true);
      return;
    }

    if (mode === "receivable-step1") {
      setFormData({
        customer: receivableData?.customer || "",
        dueDate: receivableData?.dueDate || "",
      });
      setHasInitialized(true);
      return;
    }

    if (mode === "receivable-step1.5") {
      setFormData((prev) => ({
        ...prev,
        customer: receivableData?.customer || "",
        dueDate: receivableData?.dueDate || "",
        items: receivableData?.items || [],
      }));
      setHasInitialized(true);
      return;
    }

    if (mode === "receivable-step2") {
      setFormData({
        amount: receivableData?.amount || 0,
        discount: receivableData?.discount || 0,
        subTotal: receivableData?.subTotal || 0,
        taxAble: receivableData?.taxAble || "No",
        grandTotal: receivableData?.grandTotal || 0,
      });
      setHasInitialized(true);
      return;
    }

    // For add/form mode without selectedRow
    if (mode === "add" || mode === "form") {
      setHasInitialized(true);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasInitialized, mode, selectedRow, payableData, receivableData]);

  // Compute and store subTotal and grandTotal for payable-step2
  useEffect(() => {
    if (mode === "payable-step2") {
      const discount = Number(formData.discount || 0);
      const subTotal = itemsTotal - discount;
      const tax = formData.taxAble === "Yes" ? subTotal * 0.15 : 0;
      const grandTotal = subTotal + tax;

      setFormData((prev) => ({
        ...prev,
        amount: itemsTotal,
        subTotal,
        grandTotal,
      }));
    }
  }, [mode, itemsTotal, formData.discount, formData.taxAble]);

  const handleChange = (fieldId, value) => {
    if (onCustomChange) {
      onCustomChange(fieldId, value, setFormData, formData);
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    }
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

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     setSelectedFile(e.dataTransfer.files[0]);
  //   }
  // };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!isAllowedFileType(file)) {
        setFileError("Only SVG, PNG, JPG, or GIF files are allowed.");
        setSelectedFile(null);
        return;
      }
      setFileError("");
      setSelectedFile(file);
    }
  };
  const isAllowedFileType = (file) => {
    const allowedExtensions = ["svg", "png", "jpg", "jpeg", "gif"];
    const allowedMimeTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
    ];
    const extension = file.name.split(".").pop().toLowerCase();
    return (
      allowedExtensions.includes(extension) ||
      allowedMimeTypes.includes(file.type)
    );
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedFile(e.target.files[0]);
  //   }
  // };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!isAllowedFileType(file)) {
        setFileError("Only SVG, PNG, JPG, or GIF files are allowed.");
        setSelectedFile(null);
        e.target.value = ""; // clear input
        return;
      }
      setFileError("");
      setSelectedFile(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    const finalData = { ...formData };
    if (selectedFile) {
      try {
        const base64 = await fileToBase64(selectedFile);
        finalData.file = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: base64,
        };
      } catch (error) {
        console.error("Error converting file to base64:", error);
        finalData.file = selectedFile;
      }
    }

    // Console logging for debugging
    console.log("📤 Submitting Form Data:", {
      mode,
      finalData,
      itemsCount: finalData.items?.length || 0,
      itemsTotal: (finalData.items || []).reduce(
        (sum, item) => sum + (item.total || 0),
        0,
      ),
    });

    if (onSubmit) {
      await Promise.resolve(onSubmit(finalData));
    }

    // Close modal only for final steps
    if (mode === "receivable-step2" || mode === "payable-step2") {
      setFormData({});
      setSelectedFile(null);
      onOpenChange(false);
    }
    // Don't close for step 1
  };

  const handleClose = () => {
    setFormData({});
    setSelectedFile(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (onBack) onBack();
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
          bgcolor:
            mode === "add" || mode === "form" || mode === "edit"
              ? "#FFFFFF"
              : "#F8F7FC",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onBack && (
            <IconButton
              // onClick={handleBack}
              onClick={() => {
                // Preserve items when going back
                const currentData = {
                  ...payableData,
                  items: formData.items || [],
                };
                if (onBack) onBack(currentData);
              }}
              size="small"
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <DialogTitle
            sx={{ p: 0, fontWeight: 700, color: "#1B0D3F", fontSize: "1.2rem" }}
          >
            {title}
          </DialogTitle>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <DialogContent sx={{ px: 3, py: 1 }}>
        {/* ========== ADD/FORM/EDIT MODE ========== */}
        {(mode === "add" || mode === "form" || mode === "edit") && (
          <>
            {!!error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.id}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
                  >
                    {field.label}
                  </Typography>

                  {field.type === "select" && field.optionsWithImages ? (
                    <TextField
                      select
                      fullWidth
                      value={formData[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          bgcolor: "#F9F9F9",
                        },
                      }}
                    >
                      {field.optionsWithImages.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {option.image && (
                              <img
                                src={option.image}
                                alt={option.label}
                                style={{
                                  width: 24,
                                  height: 24,
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : field.type === "select" ? (
                    <GenericSelectField
                      label={field.label}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      size="small"
                      options={field.options || []}
                      renderOption={field.renderOption}
                      placeholder={field.placeholder}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          bgcolor: "#F9F9F9",
                        },
                      }}
                    />
                  ) : (
                    <TextField
                      fullWidth
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
                    />
                  )}
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
              {showFileUpload && (
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
                          <Box
                            component="span"
                            fontWeight="bold"
                            color="#1B0D3F"
                          >
                            Click to upload
                          </Box>{" "}
                          or drag and drop
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          SVG, PNG, JPG or GIF
                        </Typography>
                        {fileError && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ mt: 1 }}
                          >
                            {fileError}
                          </Typography>
                        )}
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
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={handleSubmit}
                disabled={loading}
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
                {loading ? "Saving..." : submitButtonLabel}
              </Button>
            </Box>
          </>
        )}

        {/* ========== PAYABLE and RECEIVABLE STEP 1 ========== */}

        {mode === "payable-step1" && (
          <>
            <Box
              display="flex"
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {/* Inside mode === "payable-step1" */}
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Entity Name</Typography>
                <GenericSelectField
                  value={formData.entity || ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    // Build a lookup array from props
                    const allOptions = [
                      ...customers.map((c) => ({
                        value: c.customerName,
                        type: "customer",
                      })),
                      ...employees.map((emp) => ({
                        value: emp.employeeName,
                        type: "employee",
                      })),
                      ...vendors.map((v) => ({
                        value: v.venderName || v.vendorName,
                        type: "vendor",
                      })),
                    ];
                    const selectedOption = allOptions.find(
                      (opt) => opt.value === selectedValue,
                    );
                    handleChange("entity", selectedValue);
                    handleChange("entityCategory", selectedOption?.type || "");
                  }}
                  size="small"
                  options={[
                    ...customers.map((c) => ({
                      label: c.customerName,
                      value: c.customerName,
                      type: "customer",
                      key: `customer-${c.id || c.customerName}`,
                    })),
                    ...employees.map((emp) => ({
                      label: emp.employeeName,
                      value: emp.employeeName,
                      type: "employee",
                      key: `employee-${emp.id || emp.employeeName}`,
                    })),
                    ...vendors.map((v) => ({
                      label: v.venderName || v.vendorName,
                      value: v.venderName || v.vendorName,
                      type: "vendor",
                      key: `vendor-${v.id || v.venderName || v.vendorName}`,
                    })),
                  ]}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={option.key} {...otherProps}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <span>{option.label}</span>
                          <Chip
                            label={option.type}
                            size="small"
                            sx={{
                              ml: "auto",
                              backgroundColor:
                                option.type === "customer"
                                  ? "#4caf50"
                                  : option.type === "vendor"
                                    ? "#2196f3"
                                    : "#f44336", // employee - red
                              color: "white",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        </Box>
                      </li>
                    );
                  }}
                  renderValue={(selected) => selected || ""}
                />
              </Box>
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Due Date</Typography>
                <GenericDateField
                  fullWidth
                  value={formData.dueDate || ""}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                // onClick={handleSubmit}
                onClick={() => {
                  const step15Data = {
                    ...payableData, // This contains step 1 data
                    entity: formData.entity,
                    entityCategory: formData.entityCategory,
                    dueDate: formData.dueDate,
                  };
                  if (onStepComplete) {
                    onStepComplete(step15Data); // Pass combined data to parent
                  }
                  handleSubmit(); // This will call onSubmit with the data
                }}
                variant="contained"
                // disabled={!formData.entity || !formData.dueDate}  // disabled buttton in payable 1.5
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {mode === "payable-step1.5" && (
          <>
            <Box
              display="flex"
              gap={2}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              <Box display="flex" flexDirection="column">
                <Typography sx={{ mb: 0.5 }}>Item Name</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter item name"
                  value={newItem.itemName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemName: e.target.value })
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography sx={{ mb: 0.5 }}>Quantity</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography sx={{ mb: 0.5 }}>Price</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: Number(e.target.value) || 0,
                    })
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
            </Box>
            <Box width="100%" display="flex" justifyContent="flex-end" mt={1}>
              <Button
                onClick={handleAddItem}
                variant="contained"
                fullWidth
                disabled={!newItem.itemName}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  py: 1,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                <Add /> Add Item
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: "#1B0D3F" }}
              >
                Items
              </Typography>
              <GenericTable
                columns={[
                  { id: "itemName", label: "Item Name", width: "40%" },
                  { id: "quantity", label: "Quantity", width: "20%" },
                  { id: "price", label: "Price", width: "20%" },
                  { id: "total", label: "Total", width: "20%" },
                ]}
                data={formData.items || []}
                emptyMessage="No items added"
              />
              {(formData.items || []).length > 0 && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1B0D3F" }}
                  >
                    Total: Rs. {itemsTotal.toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => {
                  if (onBack) onBack();
                }}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  borderColor: "#1B0D3F",
                  color: "#1B0D3F",
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!formData.items?.length}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </>
        )}
        {mode === "receivable-step1" && (
          <>
            <Box
              display="flex"
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Customer Name</Typography>

                <GenericSelectField
                  value={formData.customer || ""}
                  onChange={(e) => handleChange("customer", e.target.value)}
                  size="small"
                  options={customers.map((c) => ({
                    label: c.customerName,
                    value: c.customerName,
                  }))}
                />
              </Box>
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Due Date</Typography>
                <GenericDateField
                  fullWidth
                  // type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                // onClick={handleSubmit}
                onClick={() => {
                  const step1Data = {
                    customer: formData.customer,
                    dueDate: formData.dueDate,
                  };
                  if (onStepComplete) {
                    onStepComplete(step1Data); // Pass step 1 data to parent
                  }
                  handleSubmit(); // This will call onSubmit with the data
                }}
                variant="contained"
                disabled={!formData.customer || !formData.dueDate}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {/* ========== PAYABLE and RECEIVABLE STEP 2 ========== */}
        {mode === "payable-step2" && (
          <>
            {/* Items Table */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1.5, color: "#1B0D3F" }}
              >
                Items Summary
              </Typography>
              <GenericTable
                columns={[
                  { id: "itemName", label: "Item Name", width: "40%" },
                  { id: "quantity", label: "Quantity", width: "20%" },
                  { id: "price", label: "Price", width: "20%" },
                  { id: "total", label: "Total", width: "20%" },
                ]}
                data={formData.items || []}
                emptyMessage="No items added"
              />
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                color="#1B0D3F"
                fontWeight={600}
                mb={1}
                ml={2}
              >
                Summary
              </Typography>
              <Box
                display="flex"
                gap={2}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box display="flex" flexDirection="column" width="45%">
                  <Typography>Amount</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter amount"
                    value={itemsTotal || 0}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    size="small"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        bgcolor: "white",
                      },
                    }}
                  />
                </Box>

                <Box display="flex" flexDirection="column" width="45%">
                  <Typography>Discount (%)</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter Discount Percentage"
                    value={formData.discount || ""}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        bgcolor: "white",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              display="flex"
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
              mt={1}
            >
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Sub Total</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter Sub Total"
                  value={(() => {
                    const total =
                      (Number(itemsTotal) || 0) -
                      (Number(formData.discount) || 0);
                    return isNaN(total) ? "" : total;
                  })()}
                  onChange={(e) => handleChange("subTotal", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column" width="18%">
                <Typography>Taxable</Typography>

                <TextField
                  fullWidth
                  select // ✅ correct
                  value={formData.taxAble || ""}
                  onChange={(e) => handleChange("taxAble", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Box>

              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Grand Total</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter Grand Total"
                  value={(() => {
                    const subTotal =
                      (Number(itemsTotal) || 0) -
                      (Number(formData.discount) || 0);
                    const tax =
                      formData.taxAble === "Yes" ? subTotal * 0.15 : 0;
                    const total = subTotal + tax;
                    return isNaN(total) ? "" : total;
                  })()}
                  onChange={(e) => handleChange("grandTotal", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                ></TextField>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => {
                  if (onPreview) {
                    onPreview(formData);
                  } else {
                    console.log("Preview");
                  }
                }}
                variant="contained"
                disabled={!formData.grandTotal}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!formData.grandTotal}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </>
        )}
        {mode === "receivable-step2" && (
          <>
            <Box>
              <Typography
                variant="subtitle1"
                color="#1B0D3F"
                fontWeight={600}
                mb={1}
                ml={2}
              >
                Summary
              </Typography>
              <Box
                display="flex"
                gap={2}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box display="flex" flexDirection="column" width="45%">
                  <Typography>Amount</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount || ""}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        bgcolor: "white",
                      },
                    }}
                  />
                </Box>

                <Box display="flex" flexDirection="column" width="45%">
                  <Typography>Discount (%)</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter Discount %"
                    value={formData.discount || 0}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        bgcolor: "white",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              display="flex"
              gap={2}
              justifyContent={"center"}
              alignItems={"center"}
              mt={1}
            >
              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Sub Total</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter Sub Total"
                  value={(() => {
                    const total =
                      (Number(formData.amount) || 0) -
                      (Number(formData.discount) || 0);
                    return isNaN(total) ? "" : total;
                  })()}
                  onChange={(e) => handleChange("subTotal", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>

              <Box display="flex" flexDirection="column" width="18%">
                <Typography>Taxable</Typography>
                <TextField
                  fullWidth
                  select
                  value={formData.taxAble || ""}
                  onChange={(e) => handleChange("taxAble", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Box>

              <Box display="flex" flexDirection="column" width="45%">
                <Typography>Grand Total</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter Grand Total"
                  value={(() => {
                    const subTotal =
                      (Number(formData.amount) || 0) -
                      (Number(formData.discount) || 0);
                    const tax =
                      formData.taxAble === "Yes" ? subTotal * 0.15 : 0;
                    const total = subTotal + tax;
                    return isNaN(total) ? "" : total;
                  })()}
                  onChange={(e) => handleChange("grandTotal", e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      bgcolor: "white",
                    },
                  }}
                ></TextField>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => {
                  if (onPreview) {
                    onPreview(formData);
                  } else {
                    console.log("Preview");
                  }
                }}
                variant="contained"
                // disabled={!formData.grandTotal}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  // "&.Mui-disabled": {
                  //   bgcolor: "#BDBDBD",
                  // },
                }}
              >
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                // disabled={!formData.grandTotal}
                sx={{
                  bgcolor: "#1B0D3F",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  mb: 2,
                  borderRadius: 0.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2D1B69" },
                  "&.Mui-disabled": {
                    bgcolor: "#BDBDBD",
                  },
                }}
              >
                Save
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
                {selectedRow.amount || "Rs. 0"}
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
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    onClick={() => {
                      const file = selectedRow.file;
                      if (file) {
                        if (file.data) {
                          if (
                            file.type?.startsWith("image/") ||
                            file.data.startsWith("data:image")
                          ) {
                            window.open(file.data, "_blank");
                          } else {
                            const a = document.createElement("a");
                            a.href = file.data;
                            a.download = file.name;
                            a.click();
                          }
                        } else if (file.type?.startsWith("image/")) {
                          const imageUrl = URL.createObjectURL(file);
                          window.open(imageUrl, "_blank");
                        } else {
                          const fileUrl = URL.createObjectURL(file);
                          const a = document.createElement("a");
                          a.href = fileUrl;
                          a.download = file.name;
                          a.click();
                        }
                      } else if (selectedRow.attachment) {
                        console.log("Attachment:", selectedRow.attachment);
                      }
                    }}
                  >
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
                className="modal-action-buttons"
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
                    icon: <ContentCopy />,
                    label: "Copy",
                    onClick: onCopy || (() => console.log("Copy")),
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
                  </Typography>
                </Box>
              </Box>
              {currentAccount && (
                <Box>
                  <Typography mb={1} fontWeight={900}>
                    Attention:
                  </Typography>
                  <Typography fontWeight={600} color="#555">
                    {currentAccount.name}
                  </Typography>
                  <Typography fontWeight={600} color="#555">
                    {currentAccount.address}
                  </Typography>
                  <Typography fontWeight={600} color="#555">
                    {currentAccount.phone}
                  </Typography>
                </Box>
              )}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 0.5,
                  p: 2,
                  my: 2,
                }}
              >
                {/* Get items from multiple possible sources - items, detailsData, or lines */}
                {(() => {
                  const itemsArray =
                    selectedRow.items || selectedRow.lines || [];

                  // If items is empty, try to extract from detailsData
                  if (
                    itemsArray.length === 0 &&
                    selectedRow.detailsData &&
                    typeof selectedRow.detailsData === "object"
                  ) {
                    const detailedItems = Object.values(
                      selectedRow.detailsData,
                    ).map((detail) => ({
                      id: detail.id || detail.item_id || Date.now(),
                      itemName: detail.item_name || "",
                      quantity: Number(detail.qty) || 0,
                      price: Number(detail.price) || 0,
                      total: Number(detail.total) || 0,
                    }));
                    if (detailedItems.length > 0) {
                      return (
                        <GenericTable
                          columns={[
                            {
                              id: "itemName",
                              label: "Item Name",
                              width: "40%",
                            },
                            { id: "quantity", label: "Quantity", width: "20%" },
                            { id: "price", label: "Price", width: "20%" },
                            { id: "total", label: "Total", width: "20%" },
                          ]}
                          data={detailedItems}
                          emptyMessage="No items found"
                          onRowClick={(row) => console.log("row clicked", row)}
                        />
                      );
                    }
                  }

                  return itemsArray.length > 0 ? (
                    <GenericTable
                      columns={[
                        { id: "itemName", label: "Item Name", width: "40%" },
                        { id: "quantity", label: "Quantity", width: "20%" },
                        { id: "price", label: "Price", width: "20%" },
                        { id: "total", label: "Total", width: "20%" },
                      ]}
                      data={itemsArray}
                      emptyMessage="No items found"
                      onRowClick={(row) => console.log("row clicked", row)}
                    />
                  ) : (
                    <Typography
                      color="#999"
                      fontStyle="italic"
                      textAlign="center"
                    >
                      No income entries found
                    </Typography>
                  );
                })()}
              </Paper>
              {(() => {
                const itemsSum = (selectedRow.items || []).reduce(
                  (sum, item) => sum + (Number(item?.total) || 0),
                  0,
                );
                // Use stored values when available (from backend), compute as fallback
                const subTotalRaw =
                  selectedRow.subTotal ??
                  selectedRow.sub_total ??
                  itemsSum ??
                  selectedRow.amount ??
                  0;
                const subTotal = Number(subTotalRaw) || 0;

                const discountRaw =
                  selectedRow.discount ?? selectedRow.Discount ?? 0;
                const discount = Number(discountRaw) || 0;

                const taxableRaw =
                  selectedRow.taxAble ?? selectedRow.taxable ?? "";
                const isTaxable =
                  taxableRaw === "Yes" ||
                  String(taxableRaw).toUpperCase() === "YES" ||
                  String(taxableRaw).toUpperCase() === "Y" ||
                  taxableRaw === "1" ||
                  taxableRaw === 1;

                const taxAmount = isTaxable ? Math.round(subTotal * 0.15) : 0;

                const grandTotalRaw =
                  selectedRow.grandTotal ??
                  selectedRow.grand_total ??
                  subTotal - discount + taxAmount;
                const grandTotal = Number(grandTotalRaw) || 0;

                return (
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
                      Sub Total: Rs. {subTotal.toLocaleString()}/-
                    </Typography>
                    <Typography fontWeight={600} color="#555">
                      Discount: Rs. {discount.toLocaleString()}/-
                    </Typography>
                    <Typography fontWeight={600} color="#555">
                      Taxable: {isTaxable ? "Yes (15%)" : "No"}
                    </Typography>
                    {isTaxable && (
                      <Typography fontWeight={600} color="#555">
                        Tax (15%): Rs. {taxAmount.toLocaleString()}/-
                      </Typography>
                    )}
                    <Typography
                      fontWeight={700}
                      color="#1B0D3F"
                      fontSize="1rem"
                    >
                      Grand Total: Rs. {grandTotal.toLocaleString()}/-
                    </Typography>
                  </Box>
                );
              })()}

              {mode === "transaction-detail-actions" && (
                <Box
                  className="modal-action-buttons"
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
              onClick={() => onSubmit && onSubmit("Payable")}
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
              onClick={() => onSubmit && onSubmit("Receivable")}
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
