import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = logged out
  const [isLoading, setIsLoading] = useState(true);

  // 2. Simulate checking for an existing session on startup
  useEffect(() => {
    const checkSession = async () => {
      // Later, you'll use Expo SecureStore here to auto-login
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = (userData) => {
    // In a real app, 'userData' would come from your backend/database
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access in other files
export const useAuth = () => useContext(AuthContext);
