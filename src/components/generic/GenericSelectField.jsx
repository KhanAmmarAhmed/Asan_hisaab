
import { useEffect, useMemo, useState } from "react";
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
  renderOption,
  placeholder,
}) => {
  const getLabel = (option) =>
    typeof option === "string" ? option : (option?.[optionLabel] ?? "");

  const selectedOption = useMemo(
    () =>
      options.find((opt) =>
        typeof opt === "string" ? opt === value : opt?.[optionValue] === value,
      ) || null,
    [options, optionValue, value],
  );

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedOption) {
      setInputValue(getLabel(selectedOption));
      return;
    }
    if (value === undefined || value === null) {
      setInputValue("");
      return;
    }
    setInputValue(String(value));
  }, [selectedOption, value, optionLabel]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={getLabel}
      value={selectedOption}
      inputValue={inputValue}
      onChange={(event, newValue) => {
        if (!newValue) {
          onChange({ target: { value: "" } });
          setInputValue("");
        } else {
          const val =
            typeof newValue === "string" ? newValue : newValue?.[optionValue];
          const label =
            typeof newValue === "string" ? newValue : getLabel(newValue);
          onChange({ target: { value: val } });
          setInputValue(label ?? "");
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        setInputValue(newInputValue);
        // Avoid overriding selected values (often ids) with labels during reset.
        if (reason === "reset") return;
        onChange({ target: { value: newInputValue } });
      }}
      size={size}
      fullWidth={fullWidth}
      renderOption={
        renderOption
          ? renderOption
          : (props, option, { index }) => {
            const { key, ...restProps } = props;
            const label = getLabel(option);

            return (
              <li key={`${label}-${index}`} {...restProps}>
                {label}
              </li>
            );
          }
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
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
