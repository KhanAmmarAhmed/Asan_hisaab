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

const ACCOUNTS_KEY = "accounts";
const ACTIVE_ACCOUNT_KEY = "activeAccountId";

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
    // Create account object with unique ID
    const newAccount = {
      id: Date.now().toString(),
      label: accountData.email || accountData.label || "Unknown",
      email: accountData.email,
      client_id: accountData.client_id,
      secret_key: accountData.secret_key,
      token: accountData.token,
      refresh_token: accountData.refresh_token,
      name: accountData.name || "",
    };

    setAccounts((prev) => {
      // Check if account with same client_id already exists
      const existingIndex = prev.findIndex(
        (acc) => acc.client_id === newAccount.client_id,
      );
      if (existingIndex >= 0) {
        // Update existing account
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newAccount };
        return updated;
      }
      return [...prev, newAccount];
    });

    setCurrentAccount(newAccount);
    return newAccount;
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

  const logout = useCallback(() => {
    clearAuthData();
    setIsAuthenticated(false);
    // Optionally clear current account or keep it for switching
    // setCurrentAccount(null);
    window.location.href = "/login";
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
