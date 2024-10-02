import React, { createContext, useState } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info (like role, token)

  const login = (userData) => {
    setUser(userData);  // Store token and role in user data
    localStorage.setItem('token', userData.token);  // Save the token in localStorage
    localStorage.setItem('role', userData.role);    // Save the role in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');  // Remove token from localStorage
    localStorage.removeItem('role');   // Remove role from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
