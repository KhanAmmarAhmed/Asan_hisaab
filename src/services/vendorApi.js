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

export const addVendorApi = async (vendorData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "name", vendorData?.venderName);
  appendIfPresent(formData, "number", vendorData?.phone);
  appendIfPresent(formData, "email", vendorData?.email);
  appendIfPresent(formData, "address", vendorData?.address);
  appendIfPresent(formData, "Address", vendorData?.address);

  const res = await apiClient.post("/vendor_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create vendor");
  return payload?.data ?? payload;
};

export const fetchVendorsApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_VENDOR_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/vendor_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch vendors");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.vendors ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};

export const updateVendorApi = async (vendorData) => {
  const formData = new FormData();
  formData.append("action", "edit");
  appendIfPresent(formData, "name", vendorData?.venderName);
  appendIfPresent(formData, "number", vendorData?.phone);
  appendIfPresent(formData, "email", vendorData?.email);
  appendIfPresent(formData, "address", vendorData?.address);
  appendIfPresent(formData, "vendor_id", vendorData?.id);

  const res = await apiClient.post("/vendor_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to update vendor");
  return payload?.data ?? payload;
};
