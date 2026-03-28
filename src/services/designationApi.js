// services/designationApi.js
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

/**
 * Add a new designation
 * @param {Object} designationData - designation data
 * @param {string|number} designationData.departmentId - ID of the department
 * @param {string} designationData.designationName - Name of the designation
 * @param {string} designationData.status - Status (1 for active, 0 for inactive)
 * @returns {Promise<Object>} - Response from API
 */
export const addDesignationApi = async (designationData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "department_id", designationData?.departmentId);
  appendIfPresent(formData, "designation", designationData?.designationName);
  appendIfPresent(formData, "status", designationData?.status || "1");

  const res = await apiClient.post("/designation_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create designation");
  return payload?.data ?? payload;
};

/**
 * Fetch all designations
 * @returns {Promise<Array>} - List of designations
 */
export const fetchDesignationsApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_DESIGNATION_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/designation_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch designations");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.designations ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};

/**
 * Delete a designation
 * @param {string|number} designationId - ID of the designation to delete
 * @returns {Promise<Object>} - Response from API
 */
export const deleteDesignationApi = async (designationId) => {
  const formData = new FormData();
  formData.append("action", "delete");
  appendIfPresent(formData, "designation_id", designationId);

  const res = await apiClient.post("/designation_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to delete designation");
  return payload?.data ?? payload;
};

/**
 * Update a designation
 * @param {Object} designationData - designation data
 * @param {string|number} designationData.id - ID of the designation
 * @param {string|number} designationData.departmentId - ID of the department
 * @param {string} designationData.designationName - Name of the designation
 * @param {string} designationData.status - Status (1 for active, 0 for inactive)
 * @returns {Promise<Object>} - Response from API
 */
export const updateDesignationApi = async (designationData) => {
  const formData = new FormData();
  formData.append("action", "edit");
  formData.append("designation_id", designationData?.id);
  appendIfPresent(formData, "department_id", designationData?.departmentId);
  appendIfPresent(formData, "designation", designationData?.designationName);
  appendIfPresent(formData, "status", designationData?.status);

  const res = await apiClient.post("/designation_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to update designation");
  return payload?.data ?? payload;
};
