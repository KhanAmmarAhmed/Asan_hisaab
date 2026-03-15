import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
};

const assertApiSuccess = (payload, fallbackMessage) => {
  if (typeof payload?.success === "boolean") {
    if (!payload.success) {
      throw new Error(payload?.message || payload?.error || fallbackMessage);
    }
    return;
  }

  const status = String(payload?.status ?? "").trim().toLowerCase();
  if (status && status !== "success") {
    throw new Error(payload?.message || payload?.error || fallbackMessage);
  }
};

const normalizeListPayload = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object") return Object.values(payload);
  return [];
};

export const addBankAccountApi = async (data) => {
  const formData = new FormData();
  formData.append("action", "add");

  appendIfPresent(formData, "bank_id", data?.bankId ?? data?.bank_id);
  appendIfPresent(
    formData,
    "account_title",
    data?.accountName ?? data?.account_title ?? data?.accountTitle,
  );
  appendIfPresent(
    formData,
    "account_number",
    data?.accountNumber ?? data?.account_number,
  );
  appendIfPresent(
    formData,
    "iban",
    data?.iban ?? data?.accountNumber ?? data?.account_number,
  );

  appendIfPresent(
    formData,
    "opening_balance",
    data?.balance ?? data?.opening_balance ?? data?.openingBalance,
  );
  appendIfPresent(formData, "description", data?.description ?? "");
  appendIfPresent(formData, "status", data?.status ?? 1);

  const res = await apiClient.post("/bank_account_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to create bank account");
  return payload?.data ?? payload;
};

export const fetchBankAccountsApi = async () => {
  const listAction =
    (import.meta?.env?.VITE_BANK_ACCOUNT_LIST_ACTION || "get").trim() || "get";

  const formData = new FormData();
  formData.append("action", listAction);

  const res = await apiClient.post("/bank_account_api.php", formData);
  const payload = res?.data ?? {};

  assertApiSuccess(payload, "Failed to fetch bank accounts");

  const looksWrapped =
    Object.prototype.hasOwnProperty.call(payload, "success") ||
    Object.prototype.hasOwnProperty.call(payload, "status");

  const listPayload =
    payload?.data ??
    payload?.accounts ??
    payload?.bank_accounts ??
    payload?.result ??
    (looksWrapped ? null : payload);

  return normalizeListPayload(listPayload);
};
