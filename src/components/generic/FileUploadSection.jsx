import React from "react";
import { Box, Typography, IconButton, Alert } from "@mui/material";
import { CloudUpload, Delete, InsertDriveFile } from "@mui/icons-material";

export default function FileUploadSection({ fileUpload }) {
  const {
    selectedFile,
    dragActive,
    fileError,
    inputRef,
    handleDrag,
    handleDrop,
    handleFileChange,
    onButtonClick,
    removeFile,
  } = fileUpload;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
      >
        Add File
      </Typography>

      {fileError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {fileError}
        </Alert>
      )}

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
            <CloudUpload sx={{ fontSize: 40, color: "#9E9E9E", mb: 1 }} />
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
  );
}
