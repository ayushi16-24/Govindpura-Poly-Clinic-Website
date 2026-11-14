import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginAdmin, fetchMe, TOKEN_KEY } from "../services/api";

const AuthContext = createContext(null);

// Admin login state poori app mein share karta hai
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    fetchMe()
      .then(setAdmin)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginAdmin({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  }, []);

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
