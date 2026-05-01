import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) setUser({ token });
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const register = async (name, email, password) => {
    const controller = new AbortController();
    // Set a long timeout (60 seconds) specifically for Render cold starts
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("userToken", data.token);
        setUser({ token: data.token, ...data.user });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        alert(
          "Server is still waking up. Your account was likely created; try logging in now.",
        );
      } else {
        alert(
          "Server response timed out, but please try logging in with those credentials.",
        );
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await SecureStore.setItemAsync("userToken", data.token);
        setUser({ token: data.token, ...data.user });
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Server error or cold start. Please try again.");
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
