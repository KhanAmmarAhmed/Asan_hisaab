// services/customerApi.js
import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
};

export const addCustomerApi = async (customerData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "name", customerData?.customerName);
  appendIfPresent(formData, "number", customerData?.phone);
  appendIfPresent(formData, "email", customerData?.email);
  appendIfPresent(formData, "address", customerData?.address);

  const res = await apiClient.post("/customer_api.php", formData);
  const data = res?.data ?? {};

  const status = String(data?.status ?? "").toLowerCase();
  if (status && status !== "success") {
    throw new Error(data?.message || "Failed to create customer");
  }

  // Support a few common response shapes:
  // - { status, message, data: {...} }
  // - { status, message, data: [...] }
  // - { id, name, number, ... }
  return data?.data ?? data;
};

export const fetchCustomersApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_CUSTOMER_LIST_ACTION || "list").trim() || "list";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/customer_api.php", formData);
  const data = res?.data ?? {};

  const status = String(data?.status ?? "").toLowerCase();
  if (status && status !== "success") {
    throw new Error(data?.message || "Failed to fetch customers");
  }

  return data?.data ?? data;
};
