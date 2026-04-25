import { useState, useContext, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import GenericTable from "@/components/generic/GenericTable";
import GenericFilterButton from "@/components/generic/GenericFilterButton";
import GenericModal from "@/components/generic/GenericModal";
import BalanceCards from "@/components/dashboard/BalanceCards";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GenericSelectField from "@/components/generic/GenericSelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GenericDateField from "@/components/generic/GenericDateField";
import { DataContext } from "@/context/DataContext";
import {
  addInvoiceApi,
  savePayableInvoiceApi,
  saveReceivableInvoiceApi,
  createOrderItemsApi,
  createPayableOrderApi,
  createReceivableOrderApi,
} from "@/services/invoiceApi";
import { transformInvoiceFromAPI } from "@/utils/invoiceTransformer";

const tableColumns = [
  { id: "voucher", label: "Invoice#", width: "5%" },
  { id: "type", label: "Type", width: "10%" },
  { id: "amount", label: "Amount", width: "13%" },
  // { id: "entityType", label: "Entity Type", width: "10%" },
  { id: "entity", label: "Entity", width: "10%" },
  { id: "date", label: "Date", width: "10%" },
  { id: "reference", label: "Reference", width: "10%" },
  { id: "taxAble", label: "Taxable", width: "10%" },
  { id: "madeBy", label: "Made By", width: "10%" },
  { id: "action", label: "Action", width: "7%" },
];

const statusOptions = ["All", "Payable", "Receivable"];

export default function InvoicesPage() {
  const {
    invoices,
    addInvoice,
    customers,
    vendors,
    employees,
    totalPaidInvoices,
    totalPendingInvoices,
  } = useContext(DataContext);
  const location = useLocation();
  const [selectedStatus, setSelectedStatus] = useState("All");
  // const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reference, setReference] = useState("");
  const [type, setType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [modalMode, setModalMode] = useState("add"); // "add" | "selection" | "detail-actions" | "receivable-step1" | "receivable-step2"
  const [selectedType, setSelectedType] = useState(""); // Store selected type from Green/Red buttons
  const [receivableData, setReceivableData] = useState({
    customer: "",
    dueDate: "",
    amount: "",
    discount: "",
    grandTotal: "",
  });
  const [payableData, setPayableData] = useState({
    entityName: "",
    entityCategory: "",
    dueDate: "",
    amount: "",
    discount: "",
    reference: "",
    grandTotal: "",
    description: "",
    category: "",
    subCategory: "",
    items: [],
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Cleanup modal and state when navigating away or component unmounts
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setModalMode("add");
      setSelectedRow(null);
      setShowFilters(false);
    };
  }, [location.pathname]); // Re-run cleanup when route changes

  const handleAddInvoices = (formData) => {
    const newVoucher = String(invoices.length + 1).padStart(2, "0");
    const newEntry = {
      voucher: newVoucher,
      type: selectedType || formData.type || "",
      amount: Number(formData.amount || 0),
      entityType: formData.entityType || "",
      entity: formData.entity || "",
      date: new Date().toISOString().split("T")[0],
      reference: formData.reference || "",
      taxAble: formData.taxAble || "",
      madeBy: formData.madeBy || "",
      status: "Pending",
    };
    addInvoice(newEntry);
    setIsModalOpen(false);
    resetReceivableData();
  };

  const resetPayableData = () => {
    setPayableData({
      entityName: "", // renamed from employee
      entityCategory: "", // new field
      dueDate: "",
      amount: "",
      discount: "",
      reference: "",
      grandTotal: "",
      description: "",
      category: "",
      subCategory: "",
      items: [],
    });
  };

  const resetReceivableData = () => {
    setReceivableData({
      customer: "",
      dueDate: "",
      amount: "",
      discount: "",
      grandTotal: "",
    });
  };

  const handleChange = (fieldId, value, setFormData, formData) => {
    let updatedData = { ...formData, [fieldId]: value };

    if (
      fieldId === "amount" ||
      fieldId === "discount" ||
      fieldId === "taxAble"
    ) {
      const amount = Number(
        fieldId === "amount" ? value : formData.amount || 0,
      );
      const discount = Number(
        fieldId === "discount" ? value : formData.discount || 0,
      );
      const subTotal = amount - discount;
      const isTaxable = fieldId === "taxAble" ? value : formData.taxAble;
      const tax = isTaxable === "Yes" ? subTotal * 0.15 : 0;
      const grandTotal = subTotal + tax;
      updatedData.subTotal = subTotal;
      updatedData.grandTotal = grandTotal;
    }

    setFormData(updatedData);
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const handlePrint = useCallback(() => {
    document.body.classList.add("print-detail-modal");
    const cleanup = () => document.body.classList.remove("print-detail-modal");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  }, []);

  const handleSave = useCallback(async () => {
    const dialogEl = document.querySelector('[role="dialog"] .MuiPaper-root');
    if (!dialogEl) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(dialogEl, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `invoice-${selectedRow?.voucher || "receipt"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [selectedRow]);

  const handleShare = useCallback(async () => {
    if (!selectedRow) return;
    const text =
      `Invoice Detail\n` +
      `Invoice#: ${selectedRow.voucher || ""}\n` +
      `Type: ${selectedRow.type || ""}\n` +
      `Entity: ${selectedRow.entity || ""}\n` +
      `Entity Type: ${selectedRow.entityType || ""}\n` +
      `Amount: ${selectedRow.amount || ""}\n` +
      `Grand Total: ${selectedRow.grandTotal || ""}\n` +
      `Date: ${selectedRow.date || ""}\n` +
      `Reference: ${selectedRow.reference || ""}\n` +
      `Taxable: ${selectedRow.taxAble || ""}\n` +
      `Status: ${selectedRow.status || ""}`.trim();
    try {
      if (navigator.share) {
        await navigator.share({ title: "Invoice Detail", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Invoice details copied to clipboard!");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  }, [selectedRow]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type === "Receivable") {
      setModalMode("receivable-step1");
    } else if (type === "Payable") {
      setModalMode("payable-step1");
    } else {
      // setModalMode("add");
      console.log("unable to open modal for type:", type);
    }
  };

  const handleReceivableStep1Submit = async (data) => {
    try {
      console.log(
        "🚀 Step 1: Creating receivable order via create_order_receivable.php...",
      );

      // Step 1: Call create_order_receivable.php to get invoice number
      const orderResponse = await createReceivableOrderApi({
        customer: data.customer || "",
        dueDate: data.dueDate || "",
      });

      console.log("✅ Receivable Order created, response:", orderResponse);

      if (!orderResponse?.invoice) {
        throw new Error(
          "No invoice number returned from create_order_receivable.php",
        );
      }

      // Store the invoice number and other order details
      setReceivableData((prev) => ({
        ...prev,
        customer: data.customer,
        dueDate: data.dueDate,
        invoiceNo: orderResponse.invoice,
        reference: orderResponse.invoice,
        orderId: orderResponse.id,
        orderType: orderResponse.type,
      }));

      console.log(
        "📝 Receivable data updated with invoice:",
        orderResponse.invoice,
      );
      setModalMode("receivable-step2");
    } catch (error) {
      console.error("❌ Error in Step 1:", error);
      alert(`Failed to create order: ${error.message}`);
    }
  };

  const handlePayableStep1Submit = async (data) => {
    try {
      console.log("🚀 Step 1: Creating order via create_order.php...");

      // Step 1: Call create_order.php to get invoice number
      const orderResponse = await createPayableOrderApi({
        type: "Payable",
        entity: data.entity || "",
        dueDate: data.dueDate || "",
      });

      console.log("✅ Order created, response:", orderResponse);

      if (!orderResponse?.invoice) {
        throw new Error("No invoice number returned from create_order.php");
      }

      // Store the invoice number and other order details
      setPayableData((prev) => ({
        ...prev,
        entityName: data.entity,
        entityCategory: data.entityCategory,
        dueDate: data.dueDate,
        invoiceNo: orderResponse.invoice,
        reference: orderResponse.invoice,
        orderId: orderResponse.id,
        orderType: orderResponse.type,
        items: prev.items || [],
      }));

      console.log(
        "📝 Payable data updated with invoice:",
        orderResponse.invoice,
      );
      setModalMode("payable-step1.5");
    } catch (error) {
      console.error("❌ Error in Step 1:", error);
      alert(`Failed to create order: ${error.message}`);
    }
  };

  const handlePayableStep1_5Submit = async (data) => {
    try {
      console.log("🚀 Step 1.5: Saving order items...");

      // Save items to the backend via save_order.php
      if (data.items && data.items.length > 0) {
        console.log(`📦 Creating ${data.items.length} order items...`);
        await createOrderItemsApi(payableData.invoiceNo, data.items);
        console.log("✅ Order items saved successfully!");
      }

      // Update payable data with items and category info
      setPayableData((prev) => ({
        ...prev,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        items: data.items || [],
      }));

      console.log("📝 Moving to Step 2 for payable details...");
      setModalMode("payable-step2");
    } catch (error) {
      console.error("❌ Error in Step 1.5:", error);
      alert(`Failed to save order items: ${error.message}`);
    }
  };
  const handleBackFromStep1_5 = (dataWithItems) => {
    setPayableData((prev) => ({
      ...prev,
      ...dataWithItems, // This will preserve items when going back
    }));
    setModalMode("payable-step1");
  };

  const handleReceivableStep2Submit = async (data) => {
    try {
      console.log("🚀 Step 2: Saving Receivable Invoice Details...");

      // Use the invoice number from create_order_receivable.php (Step 1)
      const invoiceNo = receivableData.invoiceNo;

      if (!invoiceNo) {
        throw new Error("Invoice number not found. Please start with Step 1.");
      }

      // Create the invoice entry for local storage
      const newEntry = {
        voucher: invoiceNo,
        type: "Receivable",
        amount: Number(data.amount || 0),
        discount: Number(data.discount || 0),
        subTotal: Number(data.subTotal || 0),
        taxAble: data.taxAble || "No",
        grandTotal: Number(data.grandTotal || 0),
        entityType: "Customer",
        entity: receivableData.customer,
        date: receivableData.dueDate,
        reference: receivableData.reference || invoiceNo,
        madeBy: "Current User",
        status: "Pending",
        description: data.description || "",
      };

      console.log("📋 Receivable Invoice Data:", {
        invoiceNo,
        amount: data.amount,
        discount: data.discount,
        subTotal: data.subTotal,
        taxAble: data.taxAble,
        grandTotal: data.grandTotal,
      });

      // Step 2: Save receivable invoice details to receivable_invoices.php
      console.log("💾 Saving receivable details to receivable_invoices.php...");
      const saveResult = await saveReceivableInvoiceApi({
        ...newEntry,
        voucher: invoiceNo,
      });
      console.log(
        "✅ Receivable details saved to API successfully!",
        saveResult,
      );

      // Invoice is fully saved via receivable_invoices.php
      console.log("✅ Invoice saved successfully to backend!");

      console.log("🎉 Receivable Invoice Creation Completed Successfully!");
      console.log("📊 Invoice Summary:", {
        invoiceNo: invoiceNo,
        entity: receivableData.customer,
        amount: data.amount,
        grandTotal: data.grandTotal,
      });

      // Close modal and refresh invoice list
      setIsModalOpen(false);
      setModalMode("selection");
      // Reset receivable data to initial state
      setReceivableData({
        customer: "",
        dueDate: "",
        amount: "",
        discount: "",
        reference: "",
        grandTotal: "",
      });
    } catch (error) {
      console.error("❌ Error creating receivable invoice:", error);
      alert(`Failed to create receivable invoice: ${error.message}`);
    }
  };

  // const handlePayableStep2Submit = (data) => {
  //   const newVoucher = String(invoices.length + 1).padStart(2, "0");
  //   const entityTypeMap = {
  //     customer: "Customer",
  //     employee: "Employee",
  //     vendor: "Vendor"
  //   };

  //   const newEntry = {
  //     voucher: newVoucher,
  //     type: "Payable",
  //     amount: Number(data.amount || 0),
  //     discount: Number(data.discount || 0),
  //     subTotal: Number(data.subTotal || 0),
  //     taxAble: data.taxAble || "",
  //     grandTotal: Number(data.grandTotal || 0),
  //     entityType: entityTypeMap[payableData.entityCategory] || "Employee",
  //     entity: payableData.entityName,
  //     date: payableData.dueDate,
  //     reference: data.reference || "",
  //     madeBy: "Current User",
  //     status: "Pending",
  //     description: data.description || payableData.description || "",
  //     category: payableData.category || "",
  //     subCategory: payableData.subCategory || "",
  //     items: payableData.items || [],
  //   };

  //   addInvoice(newEntry);
  //   console.log("Payable invoice created:", newEntry);

  //   setIsModalOpen(false);
  //   setModalMode("selection");
  //   resetPayableData();
  // };
  const handlePayableStep2Submit = async (data) => {
    try {
      console.log("🚀 Step 2: Saving Payable Invoice Details...");

      // Use the invoice number from create_order.php (Step 1)
      const invoiceNo = payableData.invoiceNo;

      if (!invoiceNo) {
        throw new Error("Invoice number not found. Please start with Step 1.");
      }

      // Map entity category to display value
      const entityTypeMap = {
        customer: "Customer",
        employee: "Employee",
        vendor: "Vendor",
      };

      // Create the invoice entry for local storage
      const newEntry = {
        voucher: invoiceNo,
        type: "Payable",
        amount: Number(data.amount || 0),
        discount: Number(data.discount || 0),
        subTotal: Number(data.subTotal || 0),
        taxAble: data.taxAble || "",
        grandTotal: Number(data.grandTotal || 0),
        entityType: entityTypeMap[payableData.entityCategory] || "Employee",
        entity: payableData.entityName,
        date: payableData.dueDate,
        reference: payableData.reference || invoiceNo,
        madeBy: "Current User",
        status: "Pending",
        description: data.description || payableData.description || "",
        category: payableData.category || "",
        subCategory: payableData.subCategory || "",
        items: payableData.items || [],
      };

      console.log("📋 Payable Invoice Data:", {
        invoiceNo,
        amount: data.amount,
        discount: data.discount,
        subTotal: data.subTotal,
        taxAble: data.taxAble,
        grandTotal: data.grandTotal,
      });

      // Step 1: Save payable invoice details to save_order.php
      console.log("💾 Saving payable details to save_order.php...");
      const saveResult = await savePayableInvoiceApi({
        ...newEntry,
        voucher: invoiceNo,
      });
      console.log("✅ Payable details saved to API successfully!", saveResult);

      // Invoice is fully saved via save_order.php, no additional API calls needed
      // The invoice will appear in the table on next refresh
      console.log("✅ Invoice saved successfully to backend!");

      console.log("🎉 Payable Invoice Creation Completed Successfully!");
      console.log("📊 Invoice Summary:", {
        invoiceNo: invoiceNo,
        entity: payableData.entityName,
        amount: data.amount,
        grandTotal: data.grandTotal,
        items: payableData.items?.length || 0,
      });

      // Close modal and refresh invoice list
      setIsModalOpen(false);
      setModalMode("selection");
      resetPayableData();
    } catch (error) {
      console.error("❌ Error creating payable invoice:", error);
      alert(`Failed to create payable invoice: ${error.message}`);
    }
  };
  const handlePreview = (formData) => {
    const itemsTotal = (payableData.items || []).reduce(
      (sum, item) => sum + (item.total || 0),
      0,
    );
    const discount = Number(formData.discount || 0);
    const subTotal = itemsTotal - discount;
    const isTaxable = formData.taxAble === "Yes";
    const tax = isTaxable ? subTotal * 0.15 : 0;
    const grandTotal = subTotal + tax;

    const previewData =
      modalMode === "receivable-step2"
        ? { ...receivableData, ...formData, type: "Receivable" }
        : {
            ...payableData,
            ...formData,
            type: "Payable",
            amount: itemsTotal,
            discount,
            subTotal,
            grandTotal,
            entityCategory: payableData.entityCategory || "employee",
          };

    // Transform the preview data if it has nested structure
    const transformedData = transformInvoiceFromAPI(previewData) || previewData;
    setSelectedRow(transformedData);
    setModalMode("transaction-detail-actions");
  };

  const handleBackToStep1 = () => {
    if (selectedRow?.type === "Receivable") {
      setModalMode("receivable-step1");
    } else {
      setModalMode("payable-step1.5");
    }
  };

  const filteredData = useMemo(() => {
    return invoices
      .filter((item) => {
        return (
          (selectedStatus === "All" || item.type === selectedStatus) &&
          (reference === "" ||
            item.reference?.toLowerCase().includes(reference.toLowerCase())) &&
          (type === "" ||
            item.type?.toLowerCase().includes(type.toLowerCase())) &&
          (entityType === "" ||
            item.entityType
              ?.toLowerCase()
              .includes(entityType.toLowerCase())) &&
          (searchDate === "" ||
            new Date(item.date).toISOString().split("T")[0] === searchDate)
        );
      })

      .map((item) => ({
        ...item,
        amount: formatCurrency(item.amount),
        action: (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(item);
              setModalMode("transaction-detail-actions");
              setIsModalOpen(true);
            }}
            size="small"
            title="View Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ),
      }));
  }, [invoices, selectedStatus, reference, type, entityType, searchDate]);

  return (
    <Box className="space-y-4">
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        <BalanceCards
          title="Paid Amount"
          amount={formatCurrency(totalPaidInvoices)}
        />
        <BalanceCards
          title="Pending Amount"
          amount={formatCurrency(totalPendingInvoices)}
        />
      </Box>

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
            setModalMode("selection");
            setSelectedRow(null);
            setIsModalOpen(true);
          }}
          sx={{
            bgcolor: "#1B0D3F",
            color: "#FFFFFF",
            fontWeight: 600,
            "&:hover": { bgcolor: "#2D1B69" },
          }}
        >
          Add Invoice
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "0.5fr 0.5fr 0.5fr 0.5fr 0.5fr",
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
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            options={[...new Set(invoices.map((i) => i.reference))].map(
              (val) => ({ label: val, value: val }),
            )}
          />
          <GenericSelectField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[...new Set(invoices.map((i) => i.type))].map((val) => ({
              label: val,
              value: val,
            }))}
          />
          <GenericSelectField
            label="Entity Type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={[...new Set(invoices.map((i) => i.entityType))].map(
              (val) => ({ label: val, value: val }),
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
            sx={{ bgcolor: "#1B0D3F", "&:hover": { bgcolor: "#2D1B69" } }}
          >
            Search
          </Button>
        </Box>
      </Collapse>

      <Box>
        <GenericFilterButton
          options={statusOptions}
          selectedOption={selectedStatus}
          onOptionChange={setSelectedStatus}
          label="Status"
        />
      </Box>

      <GenericTable
        columns={tableColumns}
        data={filteredData}
        emptyMessage="No invoice entries found"
        onRowClick={(row) => {
          // Transform the row data if it has nested structure from API
          const transformedRow = transformInvoiceFromAPI(row) || row;
          setSelectedRow(transformedRow);
          setModalMode("transaction-detail-actions");
          setIsModalOpen(true);
        }}
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          modalMode === "selection"
            ? "Generate Invoice"
            : modalMode === "receivable-step1"
              ? "Receivable Invoice - Step 1"
              : modalMode === "receivable-step2"
                ? "Receivable Invoice - Step 2"
                : modalMode === "payable-step1"
                  ? "Payable Invoice"
                  : modalMode === "payable-step2"
                    ? "Payable Invoice"
                    : modalMode === "transaction-detail-actions"
                      ? "Invoice Preview"
                      : "Add New Items"
        }
        mode={modalMode}
        fields={[
          { id: "type", label: "Type" },
          { id: "amount", label: "Amount" },
          { id: "entityType", label: "Entity Type" },
          { id: "entity", label: "Entity" },
        ]}
        selectedRow={selectedRow}
        onSubmit={
          modalMode === "selection"
            ? handleTypeSelect
            : modalMode === "receivable-step1"
              ? handleReceivableStep1Submit
              : modalMode === "receivable-step2"
                ? handleReceivableStep2Submit
                : modalMode === "payable-step1"
                  ? handlePayableStep1Submit
                  : modalMode === "payable-step1.5"
                    ? (data) => {
                        handlePayableStep1_5Submit(data);
                      }
                    : modalMode === "payable-step2"
                      ? handlePayableStep2Submit
                      : handleAddInvoices
        }
        submitButtonLabel={
          modalMode === "receivable-step1" ||
          modalMode === "payable-step1" ||
          modalMode === "payable-step1.5"
            ? "Next"
            : modalMode === "receivable-step2" || modalMode === "payable-step2"
              ? "Create Invoice"
              : modalMode === "transaction-detail-actions"
                ? ""
                : "Save Invoice"
        }
        onPrint={handlePrint}
        onShare={handleShare}
        onSave={handleSave}
        onEdit={() => console.log("Edit clicked")}
        onPreview={handlePreview}
        customers={customers}
        employees={employees}
        vendors={vendors}
        receivableData={receivableData}
        payableData={payableData}
        onBack={
          modalMode === "transaction-detail-actions"
            ? () => {
                setModalMode(
                  selectedRow?.type === "Receivable"
                    ? "receivable-step2"
                    : "payable-step2",
                );
                setSelectedRow(null);
              }
            : modalMode === "receivable-step2" || modalMode === "payable-step2"
              ? handleBackToStep1
              : modalMode === "payable-step1.5"
                ? handleBackFromStep1_5
                : null
        }
        onCustomChange={(fieldId, value, setFormData) => {
          setFormData((prev) => {
            let updatedData = { ...prev, [fieldId]: value };

            if (
              fieldId === "amount" ||
              fieldId === "discount" ||
              fieldId === "taxAble"
            ) {
              const amount = Number(
                fieldId === "amount" ? value : prev.amount || 0,
              );
              const discount = Number(
                fieldId === "discount" ? value : prev.discount || 0,
              );
              const subTotal = amount - discount;
              const isTaxable = fieldId === "taxAble" ? value : prev.taxAble;
              const tax = isTaxable === "Yes" ? subTotal * 0.15 : 0;
              const grandTotal = subTotal + tax;
              updatedData.subTotal = subTotal;
              updatedData.grandTotal = grandTotal;
            }

            return updatedData;
          });
        }}
      />
    </Box>
  );
}
