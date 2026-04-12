import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  setAuthData,
  clearAuthData,
  getToken,
  getClientId,
  getSecretKey,
} from "../utils/tokenStorage";
import { setApiLogoutHandler } from "../services/apiClient";

const AuthContext = createContext();

const getLoginPath = () => {
  const base = (import.meta?.env?.BASE_URL || "/").trim();
  if (!base || base === "/") return "/assanaccounting/login";
  // Remove trailing slash to avoid double slashes
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalized}/login`;
};

const ACCOUNTS_KEY = "accounts";
const ACTIVE_ACCOUNT_KEY = "activeAccountId";

const pickFirstValue = (...values) =>
  values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== "",
  );

const normalizeProfile = (accountData) => {
  const nested =
    accountData?.user || accountData?.profile || accountData?.data || {};

  const name = pickFirstValue(
    accountData?.name,
    accountData?.fullName,
    nested?.name,
    nested?.fullName,
  );
  const email = pickFirstValue(accountData?.email, nested?.email);
  const phone = pickFirstValue(
    accountData?.phone,
    accountData?.number,
    nested?.phone,
    nested?.number,
  );
  const address = pickFirstValue(accountData?.address, nested?.address);

  return {
    name: name || "",
    email: email || "",
    phone: phone || "",
    address: address || "",
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentAccount, setCurrentAccount] = useState(() => {
    const activeId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    if (activeId) {
      const savedAccounts = JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY) || "[]",
      );
      return savedAccounts.find((acc) => acc.id === activeId) || null;
    }
    return null;
  });

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // Save active account ID whenever currentAccount changes
  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, currentAccount.id);
    } else {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
  }, [currentAccount]);

  const saveAccount = useCallback((accountData) => {
    const profile = normalizeProfile(accountData);
    const newAccount = {
      id: Date.now().toString(),
      label: profile.email || accountData?.label || "Unknown",
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      client_id: accountData?.client_id,
      secret_key: accountData?.secret_key,
      token: accountData?.token,
      refresh_token: accountData?.refresh_token,
      name: profile.name,
    };

    let savedAccount = newAccount;

    setAccounts((prev) => {
      const existingIndex = prev.findIndex((acc) =>
        newAccount.client_id
          ? acc.client_id === newAccount.client_id
          : newAccount.email
            ? acc.email === newAccount.email
            : false,
      );
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const merged = {
          ...existing,
          ...newAccount,
          name: newAccount.name || existing.name || "",
          email: newAccount.email || existing.email || "",
          phone: newAccount.phone || existing.phone || "",
          address: newAccount.address || existing.address || "",
          label:
            newAccount.email || newAccount.label || existing.label || "Unknown",
        };
        savedAccount = merged;
        const updated = [...prev];
        updated[existingIndex] = merged;
        return updated;
      }
      return [...prev, newAccount];
    });

    setCurrentAccount(savedAccount);
    return savedAccount;
  }, []);

  const updateAccountProfile = useCallback((accountId, profileUpdates) => {
    if (!accountId) return;

    const normalized = normalizeProfile(profileUpdates);

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const email = normalized.email || acc.email || "";
        return {
          ...acc,
          name: normalized.name || acc.name || "",
          email,
          phone: normalized.phone || acc.phone || "",
          address: normalized.address || acc.address || "",
          label: email || acc.label || "Unknown",
        };
      }),
    );

    setCurrentAccount((prev) => {
      if (!prev || prev.id !== accountId) return prev;
      const email = normalized.email || prev.email || "";
      return {
        ...prev,
        name: normalized.name || prev.name || "",
        email,
        phone: normalized.phone || prev.phone || "",
        address: normalized.address || prev.address || "",
        label: email || prev.label || "Unknown",
      };
    });
  }, []);

  const switchAccount = useCallback(
    (accountId) => {
      const account = accounts.find((acc) => acc.id === accountId);
      if (account) {
        // Update auth data in localStorage
        setAuthData(account);
        setCurrentAccount(account);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [accounts],
  );

  const removeAccount = useCallback(
    (accountId) => {
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
      // If removing the current account, clear auth
      if (currentAccount?.id === accountId) {
        clearAuthData();
        setCurrentAccount(null);
        setIsAuthenticated(false);
      }
    },
    [currentAccount],
  );

  const login = useCallback(
    (data) => {
      setAuthData(data);
      setIsAuthenticated(true);
      // Save account for future switching
      saveAccount(data);
    },
    [saveAccount],
  );

  const logout = useCallback((redirectPath) => {
    clearAuthData();
    setIsAuthenticated(false);
    // Optionally clear current account or keep it for switching
    // setCurrentAccount(null);
    const safeRedirect =
      typeof redirectPath === "string" && redirectPath.trim() !== ""
        ? redirectPath
        : getLoginPath();
    console.log("🚪 Logging out - redirecting to:", safeRedirect);
    window.location.href = safeRedirect;
  }, []);

  useEffect(() => {
    // Allows the API client to trigger a consistent logout (e.g., refresh failure).
    setApiLogoutHandler(logout);
    return () => setApiLogoutHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        accounts,
        currentAccount,
        switchAccount,
        saveAccount,
        removeAccount,
        updateAccountProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
