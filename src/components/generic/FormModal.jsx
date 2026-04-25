import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FormField from "./FormField";
import FileUploadSection from "./FileUploadSection";
import { useFileUpload } from "./useFileUpload";

export default function FormModal({
  open,
  onOpenChange,
  title,
  mode = "add", // "add" | "form" | "edit"
  fields = [],
  selectedRow = null,
  onSubmit,
  submitButtonLabel = "Save",
  loading = false,
  error = "",
  showFileUpload = false,
  onCustomChange,
}) {
  const [formData, setFormData] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false);
  const fileUpload = useFileUpload();

  // Initialize form data once when modal opens
  // useEffect(() => {
  //   if (!open) {
  //     setFormData({});
  //     setHasInitialized(false);
  //     fileUpload.reset();
  //     return;
  //   }

  //   if (hasInitialized) return;

  //   if (selectedRow && (mode === "edit" || mode === "form")) {
  //     const initialData = {};
  //     fields.forEach((field) => {
  //       if (field.defaultValue !== undefined) {
  //         initialData[field.id] = field.defaultValue;
  //       } else if (selectedRow[field.id]) {
  //         initialData[field.id] = selectedRow[field.id];
  //       }
  //     });
  //     setFormData(initialData);
  //   }

  //   setHasInitialized(true);
  // }, [open, mode, selectedRow, fields, hasInitialized, fileUpload]);
  useEffect(() => {
    if (!open) {
      setFormData({});
      setHasInitialized(false);
      fileUpload.reset();
      return;
    }

    if (hasInitialized) return;

    if (selectedRow && (mode === "edit" || mode === "form")) {
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

    setHasInitialized(true);
  }, [open, mode, selectedRow, fields, hasInitialized]); // ✅ FIXED

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

  const handleSubmit = async () => {
    const finalData = { ...formData };

    if (showFileUpload) {
      const fileData = await fileUpload.getFileData();
      if (fileData) {
        finalData.file = fileData;
      }
    }

    if (onSubmit) {
      await Promise.resolve(onSubmit(finalData));
    }
  };

  const handleClose = () => {
    setFormData({});
    setHasInitialized(false);
    fileUpload.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0.5,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          bgcolor: "#FFFFFF",
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

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 2 }}>
        {!!error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={handleChange}
            />
          ))}
        </Grid>

        {showFileUpload && <FileUploadSection fileUpload={fileUpload} />}

        <Divider sx={{ my: 2 }} />

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
              borderRadius: 0.5,
              fontWeight: 600,
              "&:hover": { bgcolor: "#2D1B69" },
            }}
          >
            {loading ? "Saving..." : submitButtonLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
