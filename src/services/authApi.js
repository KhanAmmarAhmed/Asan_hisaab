import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
};

/**
 * Extracts the FIRST valid JSON object from a string that may contain
 * multiple concatenated JSON objects (e.g. the send_opt.php response).
 * Uses a brace-depth scanner — O(n), zero allocations beyond the slice.
 */
const parseMaybeDoubleJson = (raw) => {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return JSON.parse(trimmed); // let it throw naturally for non-JSON
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  const opener = trimmed[0];
  const closer = opener === "{" ? "}" : "]";

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\" && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === opener) depth++;
    else if (ch === closer) {
      depth--;
      if (depth === 0) return JSON.parse(trimmed.slice(0, i + 1));
    }
  }
  // Fallback: try to parse the whole string as-is
  return JSON.parse(trimmed);
};

// LOGIN
export const loginUser = async (data) => {
  const payload = new FormData();
  appendIfPresent(payload, "email", data?.email?.trim?.() ?? data?.email);
  appendIfPresent(payload, "password", data?.password);

  const res = await apiClient.post("/login.php", payload, {
    _skipLogoutOn401: true,
    _skipAuth: true,
  });
  return res.data;
};

// SEND OTP — uses responseType:"text" because the server may return
// two concatenated JSON objects which standard parsers reject.
export const sendOtp = async (email) => {
  const encodedEmail = encodeURIComponent((email || "").trim());
  const res = await apiClient.get(`/send_opt.php?email=${encodedEmail}`, {
    responseType: "text",
    _skipLogoutOn401: true,
    _skipAuth: true,
  });
  // Parse only the first JSON object — discard any trailing duplicate.
  return parseMaybeDoubleJson(res.data);
};

// SIGNUP
export const signupUser = async (data) => {
  const payload = new FormData();

  appendIfPresent(payload, "name", data?.name);
  appendIfPresent(payload, "email", data?.email?.trim?.() ?? data?.email);
  appendIfPresent(payload, "password", data?.password);
  appendIfPresent(payload, "number", data?.number);
  // Backend implementations vary on casing; send both to be safe.
  appendIfPresent(payload, "Address", data?.address);
  appendIfPresent(payload, "address", data?.address);
  appendIfPresent(payload, "otp", data?.otp);

  const res = await apiClient.post("/sign_up.php", payload, {
    _skipLogoutOn401: true,
    _skipAuth: true,
  });

  return res.data;
};

// VERIFY OTP AND SIGNUP (Two-step signup)
export const verifyOtpAndSignup = async (data) => {
  const payload = new FormData();

  appendIfPresent(payload, "name", data?.name);
  appendIfPresent(payload, "email", data?.email?.trim?.() ?? data?.email);
  appendIfPresent(payload, "password", data?.password);
  appendIfPresent(payload, "number", data?.number);
  appendIfPresent(payload, "Address", data?.address);
  appendIfPresent(payload, "address", data?.address);
  appendIfPresent(payload, "otp", data?.otp);

  const res = await apiClient.post("/sign_up.php", payload, {
    _skipLogoutOn401: true,
    _skipAuth: true,
  });

  return res.data;
};
