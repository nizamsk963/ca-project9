import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ca_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ca_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem("ca_user", JSON.stringify(response.data.user));
      })
      .catch(() => {
        localStorage.removeItem("ca_token");
        localStorage.removeItem("ca_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("ca_token", response.data.token);
    localStorage.setItem("ca_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const signup = async (name, email, password) => {
    const response = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("ca_token", response.data.token);
    localStorage.setItem("ca_user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Local logout should still happen if the token already expired.
    }
    localStorage.removeItem("ca_token");
    localStorage.removeItem("ca_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
