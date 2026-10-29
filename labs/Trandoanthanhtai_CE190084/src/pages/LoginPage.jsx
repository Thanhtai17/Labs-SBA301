/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: LoginPage.jsx - Màn hình đăng nhập tài khoản
 */
import React, { useState } from 'react';
import logoImg from '../assets/logo.jpg';

export const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Kiểm tra để trống
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }

    // 2. Kiểm tra thông tin đăng nhập
    if (username.trim() === 'Admin' && password.trim() === 'Admin') {
      setErrorMessage('');
      onLogin({
        id: 1,
        username: 'Admin',
        fullName: 'Quản trị viên hệ thống',
        role: 1,
      });
    } else if (username.trim() === 'Staff' && password.trim() === 'Staff') {
      setErrorMessage('');
      onLogin({
        id: 2,
        username: 'Staff',
        fullName: 'Biên tập viên Nguyễn Văn B',
        role: 2,
      });
    } else {
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  // Nút hỗ trợ điền nhanh thông tin test
  const quickFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src={logoImg} alt="FUNews Logo" className="login-logo" />
          <h2>FUNews Management</h2>
          <p>Hệ thống Quản trị Tin tức Single Page Application</p>
        </div>

        {errorMessage && <div className="alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              placeholder="Nhập Admin hoặc Staff"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            Đăng nhập hệ thống
          </button>
        </form>

        <div className="quick-fill-box">
          <span>Tài khoản kiểm thử:</span>
          <div className="quick-fill-buttons">
            <button
              type="button"
              className="btn-quick"
              onClick={() => quickFill('Admin', 'Admin')}
            >
              Admin / Admin
            </button>
            <button
              type="button"
              className="btn-quick"
              onClick={() => quickFill('Staff', 'Staff')}
            >
              Staff / Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
