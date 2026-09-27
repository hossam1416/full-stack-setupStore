"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../lib/api";

// Create authentication context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from local storage token on initial load
  useEffect(() => {
    async function restoreUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/users/me");
        setUser(data);
      } catch (err) {
        // Remove invalid or expired token
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, []);

  // Save token and set user state on login
  function login(userData, token) {
    localStorage.setItem("token", token);
    setUser(userData);
  }

  // Clear token and reset user state on logout
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // Update current user profile state
  function updateUser(userData) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context easily
export function useAuth() {
  return useContext(AuthContext);
}
