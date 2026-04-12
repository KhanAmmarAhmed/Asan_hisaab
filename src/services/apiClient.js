import axios from "axios";
import {
  clearAuthData,
  getClientId,
  getRefreshToken,
  getSecretKey,
  getToken,
  setAuthData,
  setToken,
} from "../utils/tokenStorage";

class ApiError extends Error {
  constructor(message, { status, code, data, cause } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? null;
    this.code = code ?? null;
    this.data = data ?? null;
    this.cause = cause;
  }
}

export const isApiError = (err) => err?.name === "ApiError";

const DEFAULT_API_BASE_URL = "https://fisdemoprojects.com/assanhisaab";

const getApiBaseUrl = () =>
  (import.meta?.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/+$/,
    "",
  );

const getCorsProxyUrl = () =>
  (import.meta?.env?.VITE_CORS_PROXY_URL || "").trim().replace(/\/+$/, "");

const getCorsProxyTemplate = () =>
  (import.meta?.env?.VITE_CORS_PROXY_TEMPLATE || "").trim();

const getRefreshPath = () =>
  (import.meta?.env?.VITE_API_REFRESH_PATH || "").trim();

const getLogoutRedirect = () =>
  (import.meta?.env?.VITE_AUTH_LOGOUT_REDIRECT || "/login").trim() || "/login";

let externalLogoutHandler = null;
export const setApiLogoutHandler = (fn) => {
  externalLogoutHandler = typeof fn === "function" ? fn : null;
};

const performLogout = () => {
  if (externalLogoutHandler) {
    externalLogoutHandler();
    return;
  }
  clearAuthData();
  // Instead of a hard redirect, dispatch an event so the app can show a modal
  window.dispatchEvent(new Event("session-expired"));
};

const isAbsoluteUrl = (url) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url || "");

const toAbsoluteUrl = ({ baseURL, url }) => {
  const apiBaseUrl = getApiBaseUrl();
  const effectiveBase = (baseURL || apiBaseUrl).replace(/\/+$/, "") + "/";
  if (isAbsoluteUrl(url)) return url;
  return new URL((url || "").replace(/^\/+/, ""), effectiveBase).toString();
};

const applyCorsProxy = (config) => {
  const corsProxyUrl = getCorsProxyUrl();
  const corsProxyTemplate = getCorsProxyTemplate();
  if (!corsProxyUrl && !corsProxyTemplate) return config;

  const absoluteUrl = toAbsoluteUrl({
    baseURL: config.baseURL,
    url: config.url,
  });

  let proxiedUrl;
  if (corsProxyTemplate) {
    proxiedUrl = corsProxyTemplate
      .replaceAll("{{url}}", absoluteUrl)
      .replaceAll("{{encodedUrl}}", encodeURIComponent(absoluteUrl));
  } else {
    // Default behavior: proxy expects the full target URL appended.
    proxiedUrl = `${corsProxyUrl}/${absoluteUrl}`;
  }

  return {
    ...config,
    baseURL: undefined,
    url: proxiedUrl,
  };
};

const normalizeAxiosError = (error) => {
  const status = error?.response?.status ?? null;
  const data = error?.response?.data ?? null;

  const messageFromServer =
    (typeof data === "string" && data) || data?.message || data?.error || null;

  const message =
    messageFromServer ||
    (status ? `Request failed (${status})` : "Network error");

  return new ApiError(message, {
    status,
    code: error?.code ?? null,
    data,
    cause: error,
  });
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});

// Ensure refresh calls can bypass interceptors without risking infinite loops.
const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const refreshPath = getRefreshPath();

  console.log("🔄 Token Refresh Attempt:");
  console.log("  - Refresh Token Present:", !!refreshToken);
  console.log("  - Refresh Path:", refreshPath);

  if (!refreshToken || !refreshPath) {
    console.error("❌ Cannot refresh - missing token or path");
    throw new ApiError("Refresh token not available", { status: 401 });
  }

  const payload = {
    refresh_token: refreshToken,
    client_id: getClientId(),
    secret_key: getSecretKey(),
  };

  console.log("📋 Refresh Payload:", {
    refresh_token: !!payload.refresh_token ? "✓" : "✗",
    client_id: payload.client_id || "✗ MISSING",
    secret_key: payload.secret_key || "✗ MISSING",
  });

  const config = applyCorsProxy({
    url: refreshPath,
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  const res = await refreshClient.request(config);

  // Accept a few common response shapes.
  const data = res?.data ?? {};
  const nextToken =
    data?.token ?? data?.accessToken ?? data?.access_token ?? null;

  if (!nextToken) {
    console.error("❌ Refresh succeeded but no token in response:", data);
    throw new ApiError("Refresh succeeded but no token returned", {
      status: res?.status ?? null,
      data,
    });
  }

  console.log("✅ Token refreshed successfully");

  // Update storage. If backend returns refresh token too, persist it.
  setAuthData(data);
  setToken(nextToken);

  return nextToken;
};

apiClient.interceptors.request.use((config) => {
  const next = applyCorsProxy(config);
  const token = getToken();
  const skipAuth = !!next?._skipAuth;

  if (!skipAuth && token && !next?.headers?.Authorization) {
    next.headers = next.headers || {};
    next.headers.Authorization = `Bearer ${token}`;
    console.log("📤 Token attached to request:", next.url);
  } else if (!skipAuth && !token) {
    console.warn("⚠️ No token available for request:", next.url);
  }

  return next;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status ?? null;
    const originalRequest = error?.config;
    const hasAccessToken = !!getToken();
    const canRefresh = !!getRefreshToken() && !!getRefreshPath();
    const skipLogoutOn401 = !!originalRequest?._skipLogoutOn401;

    // If unauthorized, attempt a refresh (single-flight) then retry once.
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh &&
      canRefresh
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) refreshPromise = refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        refreshPromise = null;
        performLogout();
        return Promise.reject(
          isApiError(refreshErr) ? refreshErr : normalizeAxiosError(refreshErr),
        );
      }
    }

    if (status === 401 && hasAccessToken && !skipLogoutOn401) {
      // Authenticated request got a 401 and refresh is not possible.
      performLogout();
    }

    return Promise.reject(normalizeAxiosError(error));
  },
);

export { ApiError };
export default apiClient;
