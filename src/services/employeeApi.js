import apiClient from "./apiClient";
import { normalizeEmployeeRecord } from "../utils/employeeUtils";

const EMPLOYEE_ENDPOINT = "/employee_api.php";

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
 * Scans a raw string and extracts every top-level JSON object/array.
 * The employee GET endpoint returns N concatenated JSON objects (one per
 * employee), e.g. {...}{...}{...} — standard JSON.parse rejects this,
 * so we scan with a brace-depth counter (same technique used in authApi.js).
 */
const parseAllJsonObjects = (raw) => {
  if (typeof raw !== "string") return [];
  const text = raw.trim();
  const results = [];
  let pos = 0;

  while (pos < text.length) {
    // Skip whitespace between objects
    while (pos < text.length && /\s/.test(text[pos])) pos++;
    if (pos >= text.length) break;
    if (text[pos] !== "{" && text[pos] !== "[") break;

    const opener = text[pos];
    const closer = opener === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;

    for (let i = pos; i < text.length; i++) {
      const ch = text[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\" && inString) { escaped = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === opener) depth++;
      else if (ch === closer) {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }

    if (end === -1) break;

    try {
      results.push(JSON.parse(text.slice(pos, end + 1)));
    } catch {
      break;
    }

    pos = end + 1;
  }

  return results;
};

const buildEmployeeFormData = (action, employeeData = {}) => {
  const formData = new FormData();

  formData.append("action", action);
  appendIfPresent(formData, "employee_id", employeeData?.id);
  appendIfPresent(formData, "name", employeeData?.employeeName);
  appendIfPresent(formData, "number", employeeData?.phone);
  appendIfPresent(formData, "email", employeeData?.email);
  appendIfPresent(formData, "address", employeeData?.address);
  appendIfPresent(formData, "department", employeeData?.department_id);
  appendIfPresent(formData, "designation", employeeData?.designation_id);

  return formData;
};

const createEmployeeFallback = (employeeData = {}) => ({
  id: employeeData?.id,
  name: employeeData?.employeeName,
  number: employeeData?.phone,
  email: employeeData?.email,
  address: employeeData?.address,
  department_id: employeeData?.department_id,
  designation_id: employeeData?.designation_id,
});

/**
 * Add a new employee.
 * Backend response: { success: true, data: { employee, designation, department } }
 */
export const addEmployeeApi = async (employeeData) => {
  const formData = buildEmployeeFormData("add", employeeData);
  const res = await apiClient.post(EMPLOYEE_ENDPOINT, formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create employee");

  // data is { employee: {...}, designation: {...}, department: {...} }
  const data = payload?.data ?? payload;
  return normalizeEmployeeRecord(data, createEmployeeFallback(employeeData));
};

/**
 * Fetch all employees.
 * The backend returns one JSON object per employee concatenated in the body:
 *   {"success":true,"data":{...}}{"success":true,"data":{...}}...
 * We use responseType:"text" so axios doesn't try to JSON.parse it, then
 * split all objects ourselves with a brace-depth scanner.
 */
export const fetchEmployeesApi = async () => {
  const formData = new FormData();
  formData.append("action", "get");

  const res = await apiClient.post(EMPLOYEE_ENDPOINT, formData, {
    responseType: "text",
  });

  const rawText =
    typeof res?.data === "string"
      ? res.data
      : JSON.stringify(res?.data ?? "{}");

  const allPayloads = parseAllJsonObjects(rawText);

  if (allPayloads.length === 0) return [];

  return allPayloads
    .filter((payload) => payload?.success !== false)
    .map((payload) => {
      // Each payload: { success: true, data: { employee, designation, department } }
      const data = payload?.data ?? payload;
      return normalizeEmployeeRecord(data);
    });
};

/**
 * Update an existing employee.
 * Backend response: { success: true, data: { employee, designation, department } }
 */
export const updateEmployeeApi = async (employeeData) => {
  const formData = buildEmployeeFormData("edit", employeeData);
  const res = await apiClient.post(EMPLOYEE_ENDPOINT, formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to update employee");

  const data = payload?.data ?? payload;
  return normalizeEmployeeRecord(data, createEmployeeFallback(employeeData));
};

export const deleteEmployeeApi = async (employeeId) => {
  const formData = new FormData();
  formData.append("action", "delete");
  appendIfPresent(formData, "employee_id", employeeId);

  const res = await apiClient.post(EMPLOYEE_ENDPOINT, formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to delete employee");
  return payload?.data ?? payload;
};
