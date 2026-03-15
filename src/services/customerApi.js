// services/customerApi.js
import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
};

const assertApiSuccess = (payload, fallbackMessage) => {
  // Accept multiple common response shapes.
  if (typeof payload?.success === "boolean") {
    if (!payload.success) {
      const errorMessage =
        payload?.message || payload?.error || fallbackMessage;
      // Handle "not found" gracefully - return empty instead of throwing
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
    // Handle "not found" gracefully - return empty instead of throwing
    if (errorMessage?.toLowerCase().includes("not found")) {
      return;
    }
    throw new Error(errorMessage);
  }
};

const normalizeListPayload = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object") return Object.values(payload);
  return [];
};

export const addCustomerApi = async (customerData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "name", customerData?.customerName);
  appendIfPresent(formData, "number", customerData?.phone);
  appendIfPresent(formData, "email", customerData?.email);
  // Backend sometimes uses `Address` (capital A) in responses; send both keys.
  appendIfPresent(formData, "address", customerData?.address);
  appendIfPresent(formData, "Address", customerData?.address);

  const res = await apiClient.post("/customer_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create customer");
  return payload?.data ?? payload;
};

export const fetchCustomersApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_CUSTOMER_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/customer_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch customers");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.customers ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};
