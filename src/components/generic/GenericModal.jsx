// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box,
//   Typography,
//   IconButton,
// } from '@mui/material'
// import { Close, Add } from '@mui/icons-material'

// export default function GenericModal({
//   open,
//   onOpenChange,
//   title = 'Add Item',
//   fields = [],
//   onSubmit,
//   submitButtonLabel = 'Save',
//   showAddFileButton = false,
// }) {
//   const [formData, setFormData] = useState({})

//   const handleChange = (fieldId, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [fieldId]: value,
//     }))
//   }

//   const handleSubmit = () => {
//     onSubmit(formData)
//     setFormData({})
//     onOpenChange(false)
//   }

//   const handleClose = () => {
//     setFormData({})
//     onOpenChange(false)
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
//         },
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
//         <DialogTitle sx={{ p: 0, fontWeight: 700, color: '#1B0D3F', fontSize: '1.3rem' }}>
//           {title}
//         </DialogTitle>
//         <IconButton
//           onClick={handleClose}
//           sx={{ color: '#999' }}
//         >
//           <Close />
//         </IconButton>
//       </Box>

//       <DialogContent sx={{ px: 3, py: 2 }}>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//           {fields.map((field) => {
//             if (field.type === 'textarea') {
//               return (
//                 <Box key={field.id}>
//                   <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.8, color: '#1B0D3F' }}>
//                     {field.label}
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={field.rows || 4}
//                     placeholder={field.placeholder}
//                     value={formData[field.id] || ''}
//                     onChange={(e) => handleChange(field.id, e.target.value)}
//                     required={field.required}
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1,
//                       },
//                     }}
//                   />
//                 </Box>
//               )
//             }

//             return (
//               <Box key={field.id}>
//                 <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.8, color: '#1B0D3F' }}>
//                   {field.label}
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   type={field.type || 'text'}
//                   placeholder={field.placeholder}
//                   value={formData[field.id] || ''}
//                   onChange={(e) => handleChange(field.id, e.target.value)}
//                   required={field.required}
//                   variant="outlined"
//                   size="small"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 1,
//                     },
//                   }}
//                 />
//               </Box>
//             )
//           })}
//         </Box>

//         {showAddFileButton && (
//           <Button
//             variant="text"
//             startIcon={<Add />}
//             sx={{
//               color: '#1B0D3F',
//               fontWeight: 600,
//               mt: 2,
//               textTransform: 'none',
//               '&:hover': { backgroundColor: 'rgba(27, 13, 63, 0.04)' },
//             }}
//           >
//             Add File
//           </Button>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
//         <Button
//           onClick={handleClose}
//           sx={{
//             color: '#999',
//             textTransform: 'none',
//             '&:hover': { backgroundColor: '#f5f5f5' },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           sx={{
//             backgroundColor: '#1B0D3F',
//             color: '#FFFFFF',
//             fontWeight: 600,
//             textTransform: 'none',
//             px: 3,
//             '&:hover': { backgroundColor: '#2D1B69' },
//           }}
//         >
//           {submitButtonLabel}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }
import React, { useState } from "react";
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
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";

export default function GenericModal({
  open,
  onOpenChange,
  title,
  mode = "form", // "form" | "view"
  fields = [],
  data = [],
  columns = 2,
  infoHeader, // { voucher, amount }
  onSubmit,
  submitButtonLabel = "Save",
  showAddFileButton = false,
}) {
  const [formData, setFormData] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formData);
    setFormData({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({});
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
          borderRadius: 1,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
            fontWeight: 700,
            color: "#1B0D3F",
            fontSize: "1.2rem",
          }}
        >
          {title}
        </DialogTitle>

        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Voucher + Amount Section (Transaction Detail style) */}
        {infoHeader && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "red", fontWeight: 600 }}>
              {infoHeader.voucher}
            </Typography>
            <Typography sx={{ color: "#2E7D32", fontWeight: 700 }}>
              {infoHeader.amount}
            </Typography>
          </Box>
        )}

        {/* ================= FORM MODE ================= */}
        {mode === "form" && (
          <>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid
                  item
                  xs={12}
                  sm={field.type === "textarea" ? 12 : columns === 2 ? 6 : 12}
                  key={field.id}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 0.5, color: "#1B0D3F" }}
                  >
                    {field.label}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline={field.type === "textarea"}
                    rows={field.rows || 3}
                    type={
                      field.type === "textarea" ? "text" : field.type || "text"
                    }
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.3,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box>
              {showAddFileButton && (
                <Button
                  startIcon={<Add />}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#1B0D3F",
                    alignItems: "center",
                  }}
                >
                  Add File
                </Button>
              )}
            </Box>
            <Divider />

            {/* Centered Save Button */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#1B0D3F",
                  textTransform: "none",
                  px: 5,
                  mt: 2,
                  borderRadius: 0.5,
                }}
              >
                {submitButtonLabel}
              </Button>
            </Box>
          </>
        )}

        {/* ================= VIEW MODE ================= */}
        {mode === "view" && (
          <Box
            sx={{
              border: "1px solid #DADADA",
              borderRadius: 0.5,
              p: 2,
              mt: 1,
            }}
          >
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                <Typography sx={{ color: "#555" }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
