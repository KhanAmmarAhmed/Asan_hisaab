import React from "react";
import { TextField, MenuItem, Box, Typography, Grid } from "@mui/material";
import GenericSelectField from "./GenericSelectField";

export default function FormField({ field, value, onChange, error }) {
  return (
    <Grid item xs={12} sm={field.fullWidth ? 12 : 6}>
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
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          size="small"
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0.5,
              bgcolor: "#F9F9F9",
            },
          }}
        >
          {field.optionsWithImages.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.label}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
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
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          size="small"
          options={field.options || []}
          renderOption={field.renderOption}
          placeholder={field.placeholder}
          fullWidth
          error={!!error}
          helperText={error}
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
          value={value || field.defaultValue || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          size="small"
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0.5,
              bgcolor: "#F9F9F9",
            },
          }}
        />
      )}
    </Grid>
  );
}
