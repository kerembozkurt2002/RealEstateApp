import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Try import { jwtDecode } if the default import doesn't work
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);  // Or jwtDecode(token) if using the named import
      setUser(decoded);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);  // Or jwtDecode(token) if using the named import
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
