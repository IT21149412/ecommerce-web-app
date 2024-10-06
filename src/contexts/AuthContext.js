import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode to decode the JWT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info (like role, token)

  // Load user data from localStorage if available when the app initializes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);  // Decode the token to get the user details
      setUser({
        token,
        role: decodedToken.role,
        name: decodedToken.name, // Assuming the user's name is stored in the token under 'name'
      });
    }
  }, []);

  // Save the user token and role in both context state and localStorage
  const login = (userData) => {
    const decodedToken = jwtDecode(userData.token); // Decode the token
    setUser({
      token: userData.token,
      role: decodedToken.role,
      name: decodedToken.name,  // Extract and set the user's name from the token
    });
    localStorage.setItem('token', userData.token);  // Save token in localStorage
    localStorage.setItem('role', decodedToken.role);    // Save role in localStorage
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
