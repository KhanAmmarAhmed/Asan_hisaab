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
    const res = await apiClient.post("/save_order.php", formData);
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

  const res = await apiClient.post("/save_order.php", formData);
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

  const res = await apiClient.post("/save_order.php", formData);
  const payload = res?.data ?? {};
  assertApiSuccess(payload, "Failed to update invoice");
  return payload?.data ?? payload;
};

// New API for saving payable invoice (save_order.php)
export const savePayableInvoiceApi = async (invoiceData) => {
  try {
    const formData = new FormData();
    formData.append("action", "save_invoice");
    formData.append(
      "invoice_no",
      invoiceData?.voucher || invoiceData?.invoiceNo || "",
    );
    formData.append("amount", invoiceData?.amount || 0);
    formData.append("sub_total", invoiceData?.subTotal || 0);
    formData.append("taxable", invoiceData?.taxAble === "Yes" ? "yes" : "no");
    formData.append("grand_total", invoiceData?.grandTotal || 0);
    formData.append("discount", invoiceData?.discount || 0);

    console.log("📤 Saving Payable Invoice:", {
      invoice_no: invoiceData?.voucher || invoiceData?.invoiceNo,
      amount: invoiceData?.amount,
      sub_total: invoiceData?.subTotal,
      taxable: invoiceData?.taxAble,
      grand_total: invoiceData?.grandTotal,
      discount: invoiceData?.discount,
    });

    const res = await apiClient.post("/save_order.php", formData);
    const payload = res?.data ?? {};

    console.log("✅ Save Invoice Response:", payload);
    assertApiSuccess(payload, "Failed to save payable invoice");
    return payload?.data ?? payload;
  } catch (error) {
    console.error("❌ Error saving payable invoice:", error);
    throw error;
  }
};

/**
 * Save Receivable invoice details via receivable_invoices.php
 * Endpoint: POST /receivable_invoices.php
 * Response: { success, message, data: { order, receivable_details } }
 */
export const saveReceivableInvoiceApi = async (invoiceData) => {
  try {
    const formData = new FormData();
    formData.append("action", "invoice");
    formData.append(
      "invoice_no",
      invoiceData?.voucher || invoiceData?.invoiceNo || "",
    );
    formData.append("amount", invoiceData?.amount || 0);
    formData.append("discount", invoiceData?.discount || 0);
    formData.append("sub_total", invoiceData?.subTotal || 0);
    formData.append("taxable", invoiceData?.taxAble === "Yes" ? "YES" : "NO");
    formData.append("grand_total", invoiceData?.grandTotal || 0);

    console.log("📤 Saving Receivable Invoice:", {
      invoice_no: invoiceData?.voucher || invoiceData?.invoiceNo,
      amount: invoiceData?.amount,
      discount: invoiceData?.discount,
      sub_total: invoiceData?.subTotal,
      taxable: invoiceData?.taxAble,
      grand_total: invoiceData?.grandTotal,
    });

    const res = await apiClient.post("/receivable_invoices.php", formData);
    const payload = res?.data ?? {};

    console.log("✅ Save Receivable Invoice Response:", payload);
    assertApiSuccess(payload, "Failed to save receivable invoice");
    return payload?.data ?? payload;
  } catch (error) {
    console.error("❌ Error saving receivable invoice:", error);
    throw error;
  }
};

// New API for creating order items (save_order.php with action=order)
export const createOrderItemApi = async (itemData) => {
  try {
    const formData = new FormData();
    formData.append("action", "order");
    formData.append("invoice", itemData?.invoiceNo || itemData?.voucher || "");
    formData.append("item_name", itemData?.itemName || "");
    formData.append("qty", itemData?.quantity || itemData?.qty || 0);
    formData.append("price", itemData?.price || 0);
    formData.append("total", itemData?.total || 0);

    console.log("📤 Creating Order Item:", {
      invoice: itemData?.invoiceNo || itemData?.voucher,
      item_name: itemData?.itemName,
      qty: itemData?.quantity,
      price: itemData?.price,
      total: itemData?.total,
    });

    const res = await apiClient.post("/save_order.php", formData);
    const payload = res?.data ?? {};

    console.log("✅ Create Order Item Response:", payload);
    assertApiSuccess(payload, "Failed to create order item");
    return payload?.data ?? payload;
  } catch (error) {
    console.error("❌ Error creating order item:", error);
    throw error;
  }
};

// Batch create multiple order items
export const createOrderItemsApi = async (invoiceNo, items) => {
  try {
    console.log("📤 Creating Multiple Order Items for Invoice:", invoiceNo);
    const results = [];

    for (const item of items) {
      try {
        const result = await createOrderItemApi({
          invoiceNo,
          ...item,
        });
        results.push(result);
      } catch (error) {
        console.warn(`⚠️ Failed to create item ${item.itemName}:`, error);
        results.push(null);
      }
    }

    console.log("✅ All Order Items Created:", results);
    return results;
  } catch (error) {
    console.error("❌ Error creating order items:", error);
    throw error;
  }
};

// ========== NEW: Get Invoices by Type APIs ==========

/**
 * Fetch all Receivable invoices from the backend
 * Endpoint: GET /get_invoice.php with action=Receivable
 */
export const fetchReceivableInvoicesApi = async () => {
  const startTime = Date.now();
  try {
    console.log("📥 Fetching Receivable Invoices...");

    const formData = new FormData();
    formData.append("action", "Receivable");

    const res = await apiClient.post("/get_invoice.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(`✅ Receivable Invoices Fetched (${duration}ms):`, payload);

    // Handle various response formats
    if (payload?.data && Array.isArray(payload.data)) {
      return payload.data;
    } else if (payload?.invoices && Array.isArray(payload.invoices)) {
      return payload.invoices;
    } else if (Array.isArray(payload)) {
      return payload;
    }

    console.warn("⚠️ No receivable invoices data found in response");
    return [];
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching receivable invoices (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return [];
  }
};

/**
 * Fetch all Payable invoices from the backend
 * Endpoint: GET /get_invoice.php with action=Payable
 */
export const fetchPayableInvoicesApi = async () => {
  const startTime = Date.now();
  try {
    console.log("📥 Fetching Payable Invoices...");

    const formData = new FormData();
    formData.append("action", "Payable");

    const res = await apiClient.post("/get_invoice.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(`✅ Payable Invoices Fetched (${duration}ms):`, payload);

    // Handle various response formats
    if (payload?.data && Array.isArray(payload.data)) {
      return payload.data;
    } else if (payload?.invoices && Array.isArray(payload.invoices)) {
      return payload.invoices;
    } else if (Array.isArray(payload)) {
      return payload;
    }

    console.warn("⚠️ No payable invoices data found in response");
    return [];
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching payable invoices (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return [];
  }
};

/**
 * Fetch ALL invoices (both Receivable and Payable) from the backend
 * Endpoint: GET /get_invoice.php with action=ALL
 */
export const fetchAllInvoicesApi = async () => {
  const startTime = Date.now();
  try {
    console.log("📥 Fetching All Invoices (Receivable + Payable)...");

    const formData = new FormData();
    formData.append("action", "ALL");

    const res = await apiClient.post("/get_invoice.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(`✅ All Invoices Fetched (${duration}ms):`, payload);

    // Handle various response formats
    if (payload?.data && Array.isArray(payload.data)) {
      return payload.data;
    } else if (payload?.invoices && Array.isArray(payload.invoices)) {
      return payload.invoices;
    } else if (Array.isArray(payload)) {
      return payload;
    }

    console.warn("⚠️ No invoices data found in response");
    return [];
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching all invoices (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return [];
  }
};

/**
 * Fetch a single invoice by ID from the backend
 * Endpoint: GET /get_invoice.php with action=invoice and invoice_no=XXXXXX
 */
export const fetchInvoiceByIdApi = async (invoiceNo) => {
  const startTime = Date.now();
  try {
    console.log(`📥 Fetching Invoice by ID: ${invoiceNo}`);

    const formData = new FormData();
    formData.append("action", "invoice");
    formData.append("invoice_no", invoiceNo);

    const res = await apiClient.post("/get_invoice.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(`✅ Invoice Fetched (${duration}ms):`, payload);

    // Return single invoice
    return payload?.data || payload || null;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching invoice ${invoiceNo} (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return null;
  }
};

/**
 * Create a new Payable order via create_order.php
 * Endpoint: POST /create_order.php
 * Response: { success, data: { id, invoice, entity_name, type } }
 */
export const createPayableOrderApi = async (orderData) => {
  const startTime = Date.now();
  try {
    console.log("📤 Creating Payable Order via create_order.php:", {
      entity: orderData?.entity || "",
      date: orderData?.dueDate || "",
    });

    const formData = new FormData();
    formData.append("action", "Payable");
    formData.append("entity", orderData?.entity || "");
    formData.append("date", orderData?.dueDate || "");

    const res = await apiClient.post("/create_order.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(
      `✅ Payable Order Created Successfully (${duration}ms):`,
      payload,
    );

    assertApiSuccess(payload, "Failed to create payable order");
    return payload?.data ?? payload;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error creating payable order (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

/**
 * Create a new Receivable order via create_order_receivable.php
 * Endpoint: POST /create_order_receivable.php
 * Response: { success, data: { id, invoice, entity_name, type } }
 */
export const createReceivableOrderApi = async (orderData) => {
  const startTime = Date.now();
  try {
    console.log(
      "📤 Creating Receivable Order via create_order_receivable.php:",
      {
        action: "Receivable",
        entity: orderData?.customer || "",
        date: orderData?.dueDate || "",
      },
    );

    const formData = new FormData();
    formData.append("action", "Receivable");
    formData.append("entity", orderData?.customer || "");
    formData.append("date", orderData?.dueDate || "");

    const res = await apiClient.post("/create_order_receivable.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(
      `✅ Receivable Order Created Successfully (${duration}ms):`,
      payload,
    );

    assertApiSuccess(payload, "Failed to create receivable order");
    return payload?.data ?? payload;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error creating receivable order (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

// For backward compatibility
export const createOrderApi = createPayableOrderApi;

/**
 * Fetch ALL invoices (Payable + Receivable) from get_invoice.php
 * Transforms backend response into frontend table format
 */
export const fetchAllInvoicesFromBackend = async () => {
  const startTime = Date.now();
  try {
    console.log("📥 Fetching ALL invoices from backend via get_invoice.php...");

    const formData = new FormData();
    formData.append("action", "ALL");

    const res = await apiClient.post("/get_invoice.php", formData);
    const payload = res?.data ?? {};

    const duration = Date.now() - startTime;
    console.log(
      `✅ Invoices Fetched (${duration}ms), count: ${payload?.data?.length || 0}`,
    );

    if (!payload?.success || !Array.isArray(payload?.data)) {
      console.warn("⚠️ Invalid invoice response format");
      return [];
    }

    // Transform backend response to frontend format
    const transformedInvoices = payload.data.map((invoiceData) => {
      if (!invoiceData) return null;
      const order = invoiceData.order || {};

      // --- NEW FLEXIBLE DATA DISCOVERY ---
      let itemsArray = [];
      let details = {};

      // Scan all keys of invoiceData to find items and summary details
      Object.entries(invoiceData).forEach(([key, value]) => {
        if (key === "order" || !value || typeof value !== "object") return;

        const vals = Object.values(value);
        if (vals.length === 0) return;

        // Check if this key contains items (look for item_name in any entry)
        const containsItems = vals.some(
          (v) => v && (v.item_name || v.itemName || v.item_id),
        );

        // Check if this key contains summary details (look for financial totals)
        const containsDetails = vals.some(
          (v) =>
            v &&
            (v.grand_total !== undefined ||
              v.sub_total !== undefined ||
              v.discount !== undefined ||
              v.amount !== undefined),
        );

        if (containsItems && !containsDetails) {
          // Pure items key (like Payable_details in the latest example)
          itemsArray = [...itemsArray, ...vals];
        } else if (containsDetails && !containsItems) {
          // Pure details key (like order_items in the latest example)
          if (Object.keys(details).length === 0) details = vals[0];
        } else if (containsItems && containsDetails) {
          // Mixed or legacy format - prioritize as items but extract details if missing
          if (itemsArray.length === 0) itemsArray = vals;
          if (Object.keys(details).length === 0) details = vals[0];
        }
      });

      // Dedup items by ID if necessary
      const uniqueItems = [];
      const itemIds = new Set();
      itemsArray.forEach((item) => {
        if (!item) return;
        const id = item.id || Math.random().toString();
        if (!itemIds.has(id)) {
          itemIds.add(id);
          uniqueItems.push(item);
        }
      });
      itemsArray = uniqueItems;

      const itemsSum = itemsArray.reduce(
        (sum, item) => sum + (Number(item?.total) || 0),
        0,
      );

      // Final fallback: check if discount/taxable are directly in invoiceData or order
      const discountRaw =
        details?.discount ?? invoiceData?.discount ?? order?.discount ?? 0;
      const taxableRaw =
        details?.taxable ?? invoiceData?.taxable ?? order?.taxable ?? "";
      const amountRaw =
        details?.amount ??
        invoiceData?.amount ??
        order?.amount ??
        order?.total ??
        itemsSum ??
        0;
      const subTotalRaw =
        details?.sub_total ?? invoiceData?.sub_total ?? itemsSum ?? amountRaw;
      const grandTotalRaw =
        details?.grand_total ??
        invoiceData?.grand_total ??
        order?.total ??
        amountRaw;

      const taxableStr = String(taxableRaw).toUpperCase();
      const taxAble = taxableStr === "YES" || taxableStr === "1" ? "Yes" : "No";

      return {
        id: order.id,
        voucher: order.invoice || "",
        type: order.type || "Payable",
        amount: Number(amountRaw),
        discount: Number(discountRaw),
        subTotal: Number(subTotalRaw),
        taxAble,
        grandTotal: Number(grandTotalRaw),
        entityType: order.entity_name ? "Vendor" : "Unknown",
        entity: order.entity_name || "Unknown",
        date: new Date().toISOString().split("T")[0],
        reference: order.invoice || "",
        madeBy: "System",
        status: order.total ? "Completed" : "Pending",
        description: details?.description || order?.description || "",
        category: details?.category || "",
        subCategory: details?.sub_category || "",
        items: itemsArray.map((item) => ({
          id: item.id,
          itemName: item.item_name || item.itemName,
          quantity: Number(item.qty || item.quantity || 0),
          price: Number(item.price || 0),
          total: Number(item.total || 0),
        })),
      };
    }).filter(Boolean);

    console.log(
      `✅ Transformed ${transformedInvoices.length} invoices for display`,
    );
    return transformedInvoices;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching invoices from backend (${duration}ms):`, {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return [];
  }
};
