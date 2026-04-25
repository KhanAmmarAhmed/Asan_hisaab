
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
  freeSolo = false,
}) => {
  const getLabel = (option) =>
    typeof option === "string" ? option : (option?.[optionLabel] ?? "");

  const selectedOption = useMemo(
    () =>
      options.find((opt) =>
        // Use loose equality (==) so numeric IDs from API match string values in state
        typeof opt === "string" ? opt === value : opt?.[optionValue] == value,
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
      freeSolo={freeSolo}
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
        // Only clear value when user explicitly clicks the X (clear) button.
        // Do NOT clear on "reset" — MUI fires "reset" after a valid selection
        // to update the input display, and clearing here would wipe the chosen value.
        if (reason === "clear") {
          onChange({ target: { value: "" } });
        }
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
