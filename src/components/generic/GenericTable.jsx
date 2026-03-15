// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   TablePagination,
// } from "@mui/material";

// export default function GenericTable({
//   columns,
//   data,
//   emptyMessage = "No data found",
//   onRowClick,
// }) {
//   const [page, setPage] = useState(0);
//   const rowsPerPage = 10;

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const paginatedData = data.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   return (
//     <Paper sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//       <TableContainer
//         sx={{
//           borderRadius: "5px",
//           boxShadow: "none",
//           border: "1px solid #e0e0e0",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#1B0D3F" }}>
//               {columns.map((col) => (
//                 <TableCell
//                   key={col.id}
//                   sx={{
//                     color: "#FFF",
//                     fontWeight: 600,
//                     fontSize: 14,
//                   }}
//                 >
//                   {col.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedData.map((row, index) => (
//               <TableRow
//                 key={index}
//                 hover
//                 onClick={() => onRowClick && onRowClick(row)}
//                 sx={{ cursor: onRowClick ? "pointer" : "default" }}
//               >
//                 {columns.map((col) => (
//                   <TableCell key={col.id}>{row[col.id]}</TableCell>
//                 ))}
//               </TableRow>
//             ))}

//             {data.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={columns.length} align="center">
//                   <Typography color="textSecondary">{emptyMessage}</Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={data.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         rowsPerPageOptions={[10]}
//       />
//     </Paper>
//   );
// }
import React, { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TablePagination, TableSortLabel, Box, TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function GenericTable({
  columns,
  data,
  emptyMessage = "No data found",
  onRowClick,
  // New optional props
  searchable = false,
  searchPlaceholder = "Search...",
  initialSortBy = "",
  initialSortDirection = "asc",
  rowsPerPageOptions = [5, 10, 25, 50],
  onSortChange,
  onSearchChange,
}) {
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0] || 10);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [searchText, setSearchText] = useState("");

  // Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortBy(columnId);
    setSortDirection(newDirection);
    onSortChange?.(columnId, newDirection);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPage(0); // reset to first page on search
    onSearchChange?.(value);
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Global search (case-insensitive, across all columns)
    if (searchable && searchText) {
      filtered = data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        // Handle different types (strings, numbers, dates)
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        if (aVal instanceof Date && bVal instanceof Date) {
          return sortDirection === "asc"
            ? aVal.getTime() - bVal.getTime()
            : bVal.getTime() - aVal.getTime();
        }
        // Default to string comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
        if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchable, searchText, sortBy, sortDirection]);

  // Pagination
  const paginatedData = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {/* Search input */}
      {searchable && (
        <Box sx={{ p: 2, pb: 0 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <TableContainer
        sx={{
          borderRadius: "5px",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1B0D3F" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{ color: "#FFF", fontWeight: 600, fontSize: 14 }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortDirection : "asc"}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        color: "#FFF !important",
                        "& .MuiTableSortLabel-icon": { color: "#FFF !important" },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={row.id || index} // prefer a unique id from data
                hover
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.render ? col.render(row) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {processedData.length === 0 && (
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
        count={processedData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
}