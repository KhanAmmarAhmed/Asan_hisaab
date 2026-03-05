

import { TextField, Autocomplete } from "@mui/material";

const GenericSelectField = ({
  label,
  value,
  onChange,
  options = [],
  optionLabel = "label",
  optionValue = "value",
  size = "small",
  fullWidth = true,
  sx = {},
}) => {
  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : (option?.[optionLabel] ?? "")
      }
      value={
        options.find((opt) =>
          typeof opt === "string"
            ? opt === value
            : opt?.[optionValue] === value,
        ) || null
      }
      onChange={(event, newValue) => {
        if (!newValue) {
          onChange({ target: { value: "" } });
        } else {
          const val =
            typeof newValue === "string" ? newValue : newValue?.[optionValue];
          onChange({ target: { value: val } });
        }
      }}
      size={size}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: 0.5,
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default GenericSelectField;
