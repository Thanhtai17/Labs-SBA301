/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { customerApi } from '../api/customerApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const data = res.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (customerData) => {
    setLoading(true);
    try {
      const res = await authApi.register(customerData);
      const data = res.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfileData = async (profileData) => {
    const res = await customerApi.updateMyProfile(profileData);
    if (user && user.role === 'CUSTOMER') {
      const updatedUser = { ...user, fullName: res.data.customerFullName };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const isStaff = user?.role === 'STAFF';
  const isCustomer = user?.role === 'CUSTOMER';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfileData,
        isStaff,
        isCustomer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

