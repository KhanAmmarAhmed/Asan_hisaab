import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { FilterList, ArrowDropDown } from "@mui/icons-material";

export default function GenericFilterButton({
  options,
  selectedOption,
  onOptionChange,
  label = "Filter",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      onOptionChange(option);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<FilterList sx={{ fontSize: 18 }} />}
        endIcon={<ArrowDropDown />}
        sx={{
          backgroundColor: "#1B0D3F",
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: 14,
          px: 2,
          py: 1,
          borderRadius: 0.5,
          minWidth: 0,
          "&:hover": { backgroundColor: "#2D1B69" },
        }}
      >
        {selectedOption !== "All" ? selectedOption : label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { borderRadius: 2, mt: 0.5, minWidth: 140 } },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === selectedOption}
            onClick={() => handleClose(option)}
            sx={{
              fontSize: 14,
              fontWeight: option === selectedOption ? 600 : 400,
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
