import { useState, useContext, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Collapse,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericModal from "@/components/generic/GenericModal";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";
import {
  addExpenseTransactionApi,
  fetchTransactionsApi,
} from "@/services/transactionApi";

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
  const { customers, vendors, employees } = useContext(DataContext);
  const [expenseData, setExpenseData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [entityName, setentityName] = useState("");
  const [accountHead, setAccountHead] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  const handlePrint = () => {
    document.body.classList.add("print-detail-modal");
    const cleanup = () =>
      document.body.classList.remove("print-detail-modal");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const resolveEntityName = (item) => {
    if (
      item.vendor_name ||
      item.customer_name ||
      item.employee_name ||
      item.entity_name ||
      item.entity
    ) {
      return (
        item.vendor_name ||
        item.customer_name ||
        item.employee_name ||
        item.entity_name ||
        item.entity
      );
    }
    return "[Entity Name Not Provided]";
  };

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setFetchLoading(true);
        const data = await fetchTransactionsApi("expense");

        const mappedData = (Array.isArray(data) ? data : []).map(
          (item, index) => {
            let displayDate = new Date().toISOString().split("T")[0];
            if (item.created_at) {
              displayDate = item.created_at.split(" ")[0];
            } else if (item.date || item.transaction_date) {
              displayDate = item.date || item.transaction_date;
            }

            return {
              id: item.id || item.transaction_id || index,
              voucher:
                item.voucher ||
                item.voucher_no ||
                String(index + 1).padStart(2, "0"),
              entityName: resolveEntityName(item),
              accountHead:
                item.account_head || item.accountHead || item.head || "",
              paymentMethod:
                item.payment_method || item.paymentMethod || item.method || "",
              date: displayDate,
              status: item.status || "Invoiced",
              amount: Number(item.amount || 0),
              description: item.description || "",
              entityType: item.entity || item.entityType || "vendor",
            };
          },
        );

        setExpenseData(mappedData);
      } catch (error) {
        console.error("Error fetching expense data:", error);
        setApiError("Failed to load expense data from server: " + error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  const handleAddExpense = async (formData) => {
    setLoading(true);
    setApiError("");

    try {
      const selectedEntity = entityOptions.find(
        (opt) => opt.value === formData.entityName,
      );
      const entityType = selectedEntity?.type || "vendor";

      const transactionData = {
        entity: entityType,
        accountHead: formData.accountHead || "",
        accountHeadId: undefined,
        entityName: formData.entityName || "",
        paymentMethod: formData.paymentMethod || "",
        amount: Number(formData.amount || 0),
        description: formData.description || "",
        file: formData.file || null,
      };

      if (!transactionData.accountHead) {
        setApiError("Account Head is required");
        setLoading(false);
        return;
      }

      if (!transactionData.entityName) {
        setApiError("Entity Name is required");
        setLoading(false);
        return;
      }

      const apiResponse = await addExpenseTransactionApi(transactionData);

      const newVoucher = String(expenseData.length + 1).padStart(2, "0");
      const newEntry = {
        voucher: newVoucher,
        entityName: formData.entityName || "",
        accountHead: formData.accountHead || "",
        paymentMethod: formData.paymentMethod || "",
        date: new Date().toISOString().split("T")[0],
        status: "Invoiced",
        amount: Number(formData.amount || 0),
        description: formData.description || "",
        fileName: formData.file?.name || null,
        apiId: apiResponse?.id || null,
        entityType,
      };

      setExpenseData((prev) => [newEntry, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      setApiError(
        error.message || "Failed to add expense. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = async (formData) => {
    if (!selectedRow) return;
    try {
      const updatedEntry = {
        ...selectedRow,
        ...formData,
        amount: Number(formData.amount || 0),
        description: formData.description || "",
        // Don't store file data locally - only store filename
        fileName: formData.file?.name || selectedRow.fileName || null,
      };

      if (formData.file) {
        try {
          const apiResponse = await addExpenseTransactionApi({
            entity: selectedRow.entityType || "vendor",
            accountHead: formData.accountHead,
            entityName: formData.entityName,
            paymentMethod: formData.paymentMethod,
            amount: formData.amount,
            description: formData.description,
            file: formData.file,
          });
          updatedEntry.apiId = apiResponse?.id || null;
        } catch (error) {
          console.error("Error updating via API:", error);
        }
      }

      setExpenseData((prev) =>
        prev.map((item) => (item.id === selectedRow.id ? updatedEntry : item)),
      );
      setIsModalOpen(false);
      setSelectedRow(null);
      setModalMode("add");
    } catch (error) {
      console.error("Error updating expense:", error);
      setApiError(error.message || "Failed to update expense. Please try again.");
    }
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
    ...customers.map((c) => ({
      label: c.entityName || c.customerName,
      value: c.entityName || c.customerName,
      type: "customer",
    })),
    ...vendors.map((v) => ({
      label: v.vendorName || v.venderName,
      value: v.vendorName || v.venderName,
      type: "vendor",
    })),
    ...employees.map((e) => ({
      label: e.employeeName,
      value: e.employeeName,
      type: "employee",
    })),
  ];

  const filteredData = useMemo(() => {
    return expenseData.filter((item) => {
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
  }, [expenseData, entityName, accountHead, searchDate]);

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
      {apiError && (
        <Alert severity="error" onClose={() => setApiError("")} sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      {fetchLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : expenseData.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No expense data found. Click "Add" to create a new expense entry.
        </Alert>
      ) : null}
      {!fetchLoading && (
        <>
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
                    ...expenseData.map((item) => item.entityName),
                    ...entityOptions.map((opt) => opt.value),
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
                options={[
                  ...new Set(expenseData.map((item) => item.accountHead)),
                ].map((name) => ({
                  label: name,
                  value: name,
                }))}
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
            title={
              modalMode === "add"
                ? "Add Expense Detail"
                : modalMode === "edit"
                  ? "Edit Expense Detail"
                  : "Expense Detail"
            }
            mode={modalMode}
            columns={2}
            showFileUpload={modalMode === "add" || modalMode === "edit"}
            selectedRow={selectedRow}
            onSubmit={modalMode === "edit" ? handleEditExpense : handleAddExpense}
            loading={loading}
            error={apiError}
            fields={
              modalMode === "add" || modalMode === "edit"
                ? [
                    {
                      id: "entityName",
                      label: "Entity Name",
                      type: "select",
                      options: entityOptions,
                      renderOption: (props, option) => {
                        const { key, ...otherProps } = props; // Extract key separately
                        const color =
                          option.type === "employee"
                            ? "#4caf50"
                            : option.type === "vendor"
                              ? "#ff9800"
                              : "#2196f3";

                        return (
                          <li key={key} {...otherProps}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
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
            onPrint={handlePrint}
            onShare={() => console.log("Share clicked")}
            onSave={() => console.log("Save clicked")}
            onEdit={handleOnEdit}
            onCopy={handleCopyExpense}
          />
        </>
      )}
    </Box>
  );
};

export default ExpensePage;
