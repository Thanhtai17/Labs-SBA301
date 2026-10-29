/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: Header.jsx - Thanh điều hướng đầu trang
 */
import React from 'react';
import logoImg from '../assets/logo.jpg';

export const Header = ({ currentUser, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={logoImg} alt="FUNews Logo" className="header-logo" />
        <span className="brand-title">FUNews Management System</span>
      </div>

      <div className="header-user-info">
        <div className="user-details">
          <span className="user-name">{currentUser?.fullName || currentUser?.username}</span>
          <span className={`role-badge ${currentUser?.role === 1 ? 'role-admin' : 'role-staff'}`}>
            {currentUser?.role === 1 ? 'Admin' : 'Staff'}
          </span>
        </div>
        <button type="button" className="btn-logout" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};
