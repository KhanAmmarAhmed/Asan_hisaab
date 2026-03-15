// services/transactionApi.js
import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
};

const assertApiSuccess = (payload, fallbackMessage) => {
  if (typeof payload?.success === "boolean") {
    if (!payload.success) {
      const errorMessage =
        payload?.message || payload?.error || fallbackMessage;
      if (errorMessage?.toLowerCase().includes("not found")) {
        return;
      }
      throw new Error(errorMessage);
    }
    return;
  }

  const status = String(payload?.status ?? "")
    .trim()
    .toLowerCase();
  if (status && status !== "success") {
    const errorMessage = payload?.message || payload?.error || fallbackMessage;
    if (errorMessage?.toLowerCase().includes("not found")) {
      return;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Add an income transaction
 * @param {Object} transactionData - Transaction data
 * @param {string} transactionData.entity - Entity type (e.g., "customer")
 * @param {string} transactionData.accountHead - Account head display name
 * @param {number} transactionData.accountHeadId - Account head ID (optional, will use hash of name if not provided)
 * @param {string} transactionData.customerName - Customer/Entity name
 * @param {string} transactionData.paymentMethod - Payment method
 * @param {number} transactionData.amount - Transaction amount
 * @param {string} transactionData.description - Transaction description
 * @param {File[]} transactionData.imageFiles - Array of image files
 * @returns {Promise<Object>} API response
 */
export const addIncomeTransactionApi = async (transactionData) => {
  const formData = new FormData();

  // Add required fields
  formData.append("action", "add");
  formData.append("type", "income");
  formData.append("entity", transactionData?.entity || "customer");

  // Handle head field - use ID if provided, otherwise generate from name
  if (transactionData?.accountHeadId) {
    formData.append("head", transactionData.accountHeadId);
  } else if (transactionData?.accountHead) {
    // Generate a numeric ID from account head name for consistency
    const headHash =
      Math.abs(
        transactionData.accountHead
          .split("")
          .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0),
      ) % 10000;
    formData.append("head", headHash);
  }

  // Add optional but commonly used fields
  appendIfPresent(formData, "customer_name", transactionData?.customerName);
  appendIfPresent(formData, "payment_method", transactionData?.paymentMethod);
  appendIfPresent(formData, "amount", transactionData?.amount);
  appendIfPresent(formData, "description", transactionData?.description);

  // Handle multiple image files
  let hasImages = false;
  if (
    transactionData?.imageFiles &&
    Array.isArray(transactionData.imageFiles)
  ) {
    transactionData.imageFiles.forEach((file, index) => {
      if (file instanceof File || file instanceof Blob) {
        formData.append("images", file);
        hasImages = true;
      }
    });
  }
  // Handle single file from legacy code
  else if (transactionData?.file) {
    if (
      transactionData.file instanceof File ||
      transactionData.file instanceof Blob
    ) {
      formData.append("images", transactionData.file);
      hasImages = true;
    } else if (transactionData.file.file instanceof File) {
      // Handle file object wrapper
      formData.append("images", transactionData.file.file);
      hasImages = true;
    }
  }

  // If no images provided, add a placeholder or skip the API call
  if (!hasImages) {
    // Create a minimal 1x1 transparent PNG as placeholder
    const minimalPng = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0d, 0x49, 0x44, 0x41, 0x54, 0x08, 0x5b, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x8b, 0x95, 0x97, 0xcc, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
    const blob = new Blob([minimalPng], { type: "image/png" });
    formData.append("images", blob, "placeholder.png");
  }

  const res = await apiClient.post("/transaction_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create income transaction");
  return payload?.data ?? payload;
};

/**
 * Add an expense transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} API response
 */
export const addExpenseTransactionApi = async (transactionData) => {
  const formData = new FormData();

  formData.append("action", "add");
  formData.append("type", "expense");
  formData.append("entity", transactionData?.entity || "vendor");

  appendIfPresent(formData, "head", transactionData?.accountHeadId);
  appendIfPresent(formData, "vendor_name", transactionData?.vendorName);
  appendIfPresent(formData, "payment_method", transactionData?.paymentMethod);
  appendIfPresent(formData, "amount", transactionData?.amount);
  appendIfPresent(formData, "description", transactionData?.description);

  if (
    transactionData?.imageFiles &&
    Array.isArray(transactionData.imageFiles)
  ) {
    transactionData.imageFiles.forEach((file) => {
      if (file instanceof File || file instanceof Blob) {
        formData.append("images", file);
      }
    });
  } else if (transactionData?.file) {
    if (
      transactionData.file instanceof File ||
      transactionData.file instanceof Blob
    ) {
      formData.append("images", transactionData.file);
    } else if (transactionData.file.file instanceof File) {
      formData.append("images", transactionData.file.file);
    }
  }

  const res = await apiClient.post("/transaction_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create expense transaction");
  return payload?.data ?? payload;
};

/**
 * Fetch transactions
 * @param {string} type - Transaction type (income, expense)
 * @returns {Promise<Object[]>} List of transactions
 */
export const fetchTransactionsApi = async (type = "income") => {
  try {
    const formData = new FormData();
    formData.append("action", "get");
    formData.append("type", type);

    const res = await apiClient.post("/transaction_api.php", formData);
    const payload = res?.data ?? {};

    console.log(`Fetched ${type} transactions - Raw payload:`, payload);

    // Try to extract data from various possible response structures
    let listPayload = null;

    if (payload?.data && Array.isArray(payload.data)) {
      listPayload = payload.data;
    } else if (payload?.transactions && Array.isArray(payload.transactions)) {
      listPayload = payload.transactions;
    } else if (payload?.result && Array.isArray(payload.result)) {
      listPayload = payload.result;
    } else if (Array.isArray(payload)) {
      listPayload = payload;
    } else if (
      !Object.prototype.hasOwnProperty.call(payload, "success") &&
      !Object.prototype.hasOwnProperty.call(payload, "status")
    ) {
      // If it's not a wrapped response, try to use it directly
      listPayload =
        Object.values(payload).find((val) => Array.isArray(val)) || [];
    } else {
      // API indicates success but no data found
      listPayload = [];
    }

    console.log(`Extracted ${type} list:`, listPayload);

    // Extract nested transaction objects - API returns items with nested 'transaction' property
    const extractedTransactions = listPayload.map((item) => {
      // If item has a nested transaction object, extract it
      if (item?.transaction && typeof item.transaction === "object") {
        return item.transaction;
      }
      // Otherwise use the item directly
      return item;
    });

    console.log(
      `Processed ${type} transactions (extracted nested data):`,
      extractedTransactions,
    );
    return Array.isArray(extractedTransactions) ? extractedTransactions : [];
  } catch (error) {
    console.error(`Error fetching ${type} transactions:`, error);
    // Return empty array instead of throwing to allow UI to function
    return [];
  }
};
