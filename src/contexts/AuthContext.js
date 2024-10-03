import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info (like role, token)

  // Load user data from localStorage if available when the app initializes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });  // Set user from localStorage
    }
  }, []);

  // Save the user token and role in both context state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);  // Save token in localStorage
    localStorage.setItem('role', userData.role);    // Save role in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');  // Clear token from localStorage
    localStorage.removeItem('role');   // Clear role from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
