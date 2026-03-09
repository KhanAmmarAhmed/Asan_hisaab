import { useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import { Button, Collapse, useTheme, useMediaQuery } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";

const tableColumns = [
  { id: "voucher", label: "Voucher#", width: "10%" },
  { id: "entityName", label: "Entity Name", width: "18%" },
  { id: "accountHead", label: "Account Head", width: "16%" },
  { id: "paymentMethod", label: "Payment Method", width: "16%" },
  { id: "date", label: "Date", width: "14%" },
  { id: "status", label: "Status", width: "12%" },
  { id: "amount", label: "Amount", width: "14%" },
];

const paymentOptions = [
  "Cash",
  "Bank",
  "Cheque",
  "Online Transfer",
  "Credit Card",
  "Debit Card",
];

const ExpensePage = () => {
  // const { expenses, addExpense, updateExpense, customers } = useContext(DataContext);
  const { expenses, addExpense, updateExpense, customers, vendors, employees } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [entityName, setentityName] = useState("");
  const [accountHead, setAccountHead] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddExpense = (formData) => {
    const newVoucher = String(expenses.length + 1).padStart(2, "0");

    const newEntry = {
      voucher: newVoucher,
      entityName: formData.entityName || "",
      accountHead: formData.accountHead || "",
      paymentMethod: formData.paymentMethod || "",
      date: new Date().toISOString().split("T")[0],
      status: "Invoiced",
      amount: Number(formData.amount || 0),
      description: formData.description || "",
      file: formData.file || null,
    };

    addExpense(newEntry);
    setIsModalOpen(false);
  };

  const handleEditExpense = (formData) => {
    if (!selectedRow) return;
    const updatedEntry = {
      ...selectedRow,
      ...formData,
      amount: Number(formData.amount || 0),
      description: formData.description || "",
      file: formData.file || selectedRow.file || null,
    };
    updateExpense(selectedRow.id, updatedEntry);
    setIsModalOpen(false);
    setSelectedRow(null);
    setModalMode("add");
  };

  const handleCopyExpense = () => {
    if (!selectedRow) return;
    const { id, voucher, ...rest } = selectedRow;
    setSelectedRow({ ...rest, id: undefined, voucher: undefined });
    setModalMode("add");
  };

  const handleOnEdit = () => {
    setModalMode("edit");
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const entityOptions = [
    ...customers.map(c => ({
      label: c.entityName || c.customerName,
      value: c.entityName || c.customerName,
      type: "customer"
    })),
    ...vendors.map(v => ({
      label: v.vendorName || v.venderName,
      value: v.vendorName || v.venderName,
      type: "vendor"
    })),
    ...employees.map(e => ({
      label: e.employeeName,
      value: e.employeeName,
      type: "employee"
    }))
  ];

  const filteredData = useMemo(() => {
    return expenses.filter((item) => {
      return (
        (entityName === "" ||
          (item.entityName || "")
            .toLowerCase()
            .includes(entityName.toLowerCase())) &&
        (accountHead === "" ||
          (item.accountHead || "")
            .toLowerCase()
            .includes(accountHead.toLowerCase())) &&
        (searchDate === "" ||
          new Date(item.date).toISOString().split("T")[0] === searchDate)
      );
    });
  }, [expenses, entityName, accountHead, searchDate]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalMode("detail-actions");
    setIsModalOpen(true);
  };

  const handleModalClose = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setModalMode("add");
      setSelectedRow(null);
    }
  };

  return (
    <Box className="space-y-4">
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<FilterList />}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setModalMode("add");
            setSelectedRow(null);
            setIsModalOpen(true);
          }}
          sx={{
            backgroundColor: "#1B0D3F",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: 14,
            px: 2.5,
            "&:hover": { backgroundColor: "#2D1B69" },
          }}
        >
          Add
        </Button>
      </Box>
      <Collapse in={showFilters}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 0.5fr",
            },
            gap: 2,
            width: "100%",
            mt: 2,
            p: isMobile ? 2 : 0,
            backgroundColor: isMobile ? "#f9f9f9" : "transparent",
            borderRadius: isMobile ? 1 : 0,
          }}
        >
          <GenericSelectField
            label="Entity Name"
            value={entityName}
            onChange={(e) => setentityName(e.target.value)}
            options={[
              ...new Set([
                ...expenses.map((item) => item.entityName),
                ...customers.map((c) => c.entityName),
              ]),
            ].map((name) => ({
              label: name,
              value: name,
            }))}
          />
          <GenericSelectField
            label="Account Head"
            value={accountHead}
            onChange={(e) => setAccountHead(e.target.value)}
            options={[...new Set(expenses.map((item) => item.accountHead))].map(
              (name) => ({
                label: name,
                value: name,
              }),
            )}
          />
          <GenericDateField
            value={searchDate}
            onChange={(valOrEvent) =>
              setSearchDate(valOrEvent?.target?.value ?? valOrEvent ?? "")
            }
          />

          <Button
            variant="contained"
            sx={{
              borderRadius: 0.5,
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" },
            }}
          >
            Search
          </Button>
        </Box>
      </Collapse>

      <GenericTable
        columns={tableColumns}
        data={filteredData.map((item) => ({
          ...item,
          amount: formatCurrency(item.amount),
        }))}
        emptyMessage="No expense entries found"
        onRowClick={handleRowClick}
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title={modalMode === "add" ? "Add Expense Detail" : modalMode === "edit" ? "Edit Expense Detail" : "Expense Detail"}
        mode={modalMode}
        columns={2}
        showFileUpload={modalMode === "add" || modalMode === "edit"}
        selectedRow={selectedRow}
        onSubmit={modalMode === "edit" ? handleEditExpense : handleAddExpense}
        fields={
          modalMode === "add" || modalMode === "edit"
            ? [
              {
                id: "entityName",
                label: "Entity Name",
                type: "select",
                options: entityOptions,
                renderOption: (props, option) => {
                  const color =
                    option.type === "employee"
                      ? "#4caf50"
                      : option.type === "vendor"
                        ? "#ff9800"
                        : "#2196f3";

                  return (
                    <li {...props}>
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {option.label}

                        <Box
                          sx={{
                            ml: "auto",
                            px: 1,
                            py: 0.2,
                            borderRadius: "12px",
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: color,
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        >
                          {option.type}
                        </Box>
                      </Box>
                    </li>
                  );
                },
              },
              { id: "accountHead", label: "Account Head" },
              {
                id: "paymentMethod",
                label: "Payment Method",
                placeHolder: "Select payment method",
                type: "select",
                options: paymentOptions,
              },
              { id: "amount", label: "Amount" },
              {
                id: "description",
                label: "Description",
                type: "textarea",
                rows: 2,
                fullWidth: true,
              },
            ]
            : [
              { id: "entityName", label: "Customer Name" },
              { id: "accountHead", label: "Account Head" },
              { id: "paymentMethod", label: "Payment Method" },
              { id: "date", label: "Date" },
              { id: "amount", label: "Amount" },
            ]
        }
        onPrint={() => window.print()}
        onShare={() => console.log("Share clicked")}
        onSave={() => console.log("Save clicked")}
        onEdit={handleOnEdit}
        onCopy={handleCopyExpense}
      />
    </Box>
  );
};

export default ExpensePage;
