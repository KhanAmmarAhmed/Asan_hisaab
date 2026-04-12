const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const CLIENT_ID_KEY = "client_id";
const SECRET_KEY = "secret_key";

const pick = (...values) =>
  values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== "",
  );

const readTokenFromPayload = (data) =>
  pick(
    data?.token,
    data?.accessToken,
    data?.access_token,
    data?.data?.token,
    data?.data?.accessToken,
    data?.data?.access_token,
    data?.user?.token,
    data?.user?.accessToken,
    data?.user?.access_token,
  );

const readRefreshTokenFromPayload = (data) =>
  pick(
    data?.refresh_token,
    data?.refreshToken,
    data?.data?.refresh_token,
    data?.data?.refreshToken,
    data?.user?.refresh_token,
    data?.user?.refreshToken,
  );

const readClientIdFromPayload = (data) =>
  pick(data?.client_id, data?.data?.client_id, data?.user?.client_id);

const readSecretKeyFromPayload = (data) =>
  pick(data?.secret_key, data?.data?.secret_key, data?.user?.secret_key);

export const setAuthData = (data) => {
  const accessToken = readTokenFromPayload(data);
  const refreshToken = readRefreshTokenFromPayload(data);
  const clientId = readClientIdFromPayload(data);
  const secretKey = readSecretKeyFromPayload(data);

  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  else console.warn("No access token found in:", data);

  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else console.warn("No refresh token found in:", data);

  if (clientId) localStorage.setItem(CLIENT_ID_KEY, clientId);
  else console.warn("No client_id found in:", data);

  if (secretKey) localStorage.setItem(SECRET_KEY, secretKey);
  else console.warn("No secret_key found in:", data);
};

export const setToken = (token) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getClientId = () => localStorage.getItem(CLIENT_ID_KEY);
export const getSecretKey = () => localStorage.getItem(SECRET_KEY);

export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CLIENT_ID_KEY);
  localStorage.removeItem(SECRET_KEY);
};
