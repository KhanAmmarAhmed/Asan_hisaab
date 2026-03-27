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

export const addEmployeeApi = async (employeeData) => {
  const formData = new FormData();
  formData.append("action", "add");
  appendIfPresent(formData, "name", employeeData?.employeeName);
  appendIfPresent(formData, "number", employeeData?.phone);
  appendIfPresent(formData, "email", employeeData?.email);
  appendIfPresent(formData, "address", employeeData?.address);
  appendIfPresent(formData, "department", employeeData?.department);
  appendIfPresent(formData, "designation", employeeData?.designation);

  const res = await apiClient.post("/employee_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create employee");
  // console.log("in employeeAPI", formData);
  return payload?.data ?? payload;
};

export const fetchEmployeesApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_EMPLOYEE_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/employee_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch employees");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.employees ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};
