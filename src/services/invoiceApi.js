import apiClient from "./apiClient";

const assertApiSuccess = (payload, fallbackMessage) => {
  if (typeof payload?.success === "boolean") {
    if (!payload.success) {
      const errorMessage =
        payload?.message || payload?.error || fallbackMessage;
      throw new Error(errorMessage);
    }
    return;
  }

  const status = String(payload?.status ?? "")
    .trim()
    .toLowerCase();
  
  if (status && status !== "success") {
    const errorMessage = payload?.message || payload?.error || fallbackMessage;
    throw new Error(errorMessage);
  }
};

export const fetchInvoicesApi = async () => {
    try {
        const formData = new FormData();
        formData.append("action", "get");
        const res = await apiClient.post("/invoice_api.php", formData);
        const payload = res?.data ?? {};
    
        if (payload?.data && Array.isArray(payload.data)) {
            return payload.data;
        } else if (payload?.invoices && Array.isArray(payload.invoices)) {
            return payload.invoices;
        } else if (Array.isArray(payload)) {
            return payload;
        }
        return [];
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
    }
};

export const addInvoiceApi = async (invoiceData) => {
    const formData = new FormData();
    formData.append("action", "add");
    formData.append("voucher", invoiceData?.voucher || "");
    formData.append("type", invoiceData?.type || "");
    formData.append("amount", invoiceData?.amount || 0);
    formData.append("discount", invoiceData?.discount || 0);
    formData.append("subTotal", invoiceData?.subTotal || 0);
    formData.append("taxAble", invoiceData?.taxAble || "");
    formData.append("grandTotal", invoiceData?.grandTotal || 0);
    formData.append("entityType", invoiceData?.entityType || "");
    formData.append("entity", invoiceData?.entity || "");
    formData.append("date", invoiceData?.date || "");
    formData.append("reference", invoiceData?.reference || "");
    formData.append("madeBy", invoiceData?.madeBy || "");
    formData.append("status", invoiceData?.status || "Pending");
    formData.append("description", invoiceData?.description || "");
    formData.append("category", invoiceData?.category || "");
    formData.append("subCategory", invoiceData?.subCategory || "");
    formData.append("items", JSON.stringify(invoiceData?.items || []));
    
    const res = await apiClient.post("/invoice_api.php", formData);
    const payload = res?.data ?? {};
    assertApiSuccess(payload, "Failed to create invoice");
    return payload?.data ?? payload;
};

export const updateInvoiceApi = async (invoiceData) => {
    const formData = new FormData();
    formData.append("action", "update");
    formData.append("id", invoiceData?.id || "");
    formData.append("status", invoiceData?.status || "");
    // ...other updatable fields as necessary
    
    const res = await apiClient.post("/invoice_api.php", formData);
    const payload = res?.data ?? {};
    assertApiSuccess(payload, "Failed to update invoice");
    return payload?.data ?? payload;
};
