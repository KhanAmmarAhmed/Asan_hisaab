import apiClient from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
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

// SEND OTP
export const sendOtp = async (email) => {
  const encodedEmail = encodeURIComponent((email || "").trim());
  const res = await apiClient.get(`/send_opt.php?email=${encodedEmail}`, {
    _skipLogoutOn401: true,
    _skipAuth: true,
  });
  return res.data;
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
