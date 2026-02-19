
import { TextField } from "@mui/material";

const GenericDateField = ({
    label = "Select Date",
    value,
    onChange,
    size = "small",
    fullWidth = true,
    sx = {},
}) => {
    return (
        <TextField
            type="date"
            label={label}
            value={value}
            onChange={onChange}
            size={size}
            fullWidth={fullWidth}
            InputLabelProps={{ shrink: true }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#FFFFFF",
                    borderRadius: 0.5,
                },
                ...sx,
            }}
        />
    );
};

export default GenericDateField;
