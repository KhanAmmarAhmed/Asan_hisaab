const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const CLIENT_ID_KEY = "client_id";
const SECRET_KEY = "secret_key";

const readTokenFromPayload = (data) =>
    data?.token ?? data?.accessToken ?? data?.access_token ?? null;

const readRefreshTokenFromPayload = (data) =>
    data?.refresh_token ?? data?.refreshToken ?? null;

export const setAuthData = (data) => {
    const accessToken = readTokenFromPayload(data);
    const refreshToken = readRefreshTokenFromPayload(data);

    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    if (data?.client_id) localStorage.setItem(CLIENT_ID_KEY, data.client_id);
    if (data?.secret_key) localStorage.setItem(SECRET_KEY, data.secret_key);
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
