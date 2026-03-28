// services/departmentApi.js
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
 * Add a new department
 * @param {Object} departmentData - Department data
 * @param {string} departmentData.departmentName - Name of the department
 * @param {string} departmentData.status - Status (1 for active, 0 for inactive)
 * @returns {Promise<Object>} - Response from API
 */
export const addDepartmentApi = async (departmentData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "departments_name", departmentData?.departmentName);
  appendIfPresent(formData, "status", departmentData?.status || "1");

  const res = await apiClient.post("/departments_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create department");
  return payload?.data ?? payload;
};

/**
 * Fetch all departments
 * @returns {Promise<Array>} - List of departments
 */
export const fetchDepartmentsApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_DEPARTMENT_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/departments_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch departments");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.departments ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};

/**
 * Delete a department
 * @param {string|number} departmentId - ID of the department to delete
 * @returns {Promise<Object>} - Response from API
 */
export const deleteDepartmentApi = async (departmentId) => {
  const formData = new FormData();
  formData.append("action", "delete");
  appendIfPresent(formData, "department_id", departmentId);

  const res = await apiClient.post("/departments_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to delete department");
  return payload?.data ?? payload;
};

/**
 * Update a department
 * @param {Object} departmentData - Department data
 * @param {string|number} departmentData.id - ID of the department
 * @param {string} departmentData.departmentName - Name of the department
 * @param {string} departmentData.status - Status (1 for active, 0 for inactive)
 * @returns {Promise<Object>} - Response from API
 */
export const updateDepartmentApi = async (departmentData) => {
  const formData = new FormData();
  formData.append("action", "edit");
  appendIfPresent(formData, "department_id", departmentData?.id);
  appendIfPresent(formData, "departments_name", departmentData?.departmentName);
  appendIfPresent(formData, "status", departmentData?.status);

  const res = await apiClient.post("/departments_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to update department");
  return payload?.data ?? payload;
};
