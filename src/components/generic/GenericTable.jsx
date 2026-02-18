// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
// } from "@mui/material";

// export default function GenericTable({
//   columns,
//   data,
//   emptyMessage = "No data found",
// }) {
//   return (
//     <TableContainer
//       component={Paper}
//       sx={{ borderRadius: 0.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
//     >
//       <Table sx={{ minWidth: 700 }} aria-label="data table">
//         <TableHead>
//           <TableRow sx={{ backgroundColor: "#1B0D3F" }}>
//             {columns.map((col) => (
//               <TableCell
//                 key={col.id}
//                 sx={{
//                   color: "#FFF",
//                   fontWeight: 600,
//                   fontSize: 14,
//                   width: col.width,
//                   borderBottom: "none",
//                   py: 2,
//                   "&:first-of-type": { pl: 3 },
//                   "&:last-of-type": { pr: 3 },
//                 }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((row, index) => (
//             <TableRow
//               key={index}
//               sx={{
//                 backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#FFF",
//                 "&:hover": { backgroundColor: "#EEEDF2" },
//               }}
//             >
//               {columns.map((col) => (
//                 <TableCell
//                   key={`${index}-${col.id}`}
//                   sx={{
//                     py: 2.5,
//                     fontSize: 14,
//                     color: "#333",
//                     "&:first-of-type": { pl: 3 },
//                     "&:last-of-type": { pr: 3 },
//                   }}
//                 >
//                   {row[col.id]}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//           {data.length === 0 && (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length}
//                 sx={{ textAlign: "center", py: 6 }}
//               >
//                 <Typography variant="body1" sx={{ color: "#999" }}>
//                   {emptyMessage}
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";

export default function GenericTable({
  columns,
  data,
  emptyMessage = "No data found",
}) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ borderRadius: 0.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1B0D3F" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{
                    color: "#FFF",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col.id}>{row[col.id]}</TableCell>
                ))}
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="textSecondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
}
