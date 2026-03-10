import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { setAuthData, clearAuthData, getToken } from "../utils/tokenStorage";
import { setApiLogoutHandler } from "../services/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());


    const login = useCallback((data) => {
        setAuthData(data);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        clearAuthData();
        setIsAuthenticated(false);
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
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
