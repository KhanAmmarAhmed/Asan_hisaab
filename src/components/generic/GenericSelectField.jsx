import { TextField, MenuItem } from "@mui/material";

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
        <TextField
            select
            label={label}
            value={value}
            onChange={onChange}
            size={size}
            fullWidth={fullWidth}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#FFFFFF",
                    borderRadius: 0.5,
                },
                ...sx,

            }}
        >
            {options.map((option, index) => (
                <MenuItem
                    key={index}
                    value={option[optionValue] ?? option}
                >
                    {option[optionLabel] ?? option}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default GenericSelectField;
