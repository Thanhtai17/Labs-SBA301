/**
 * Project: FUNewsManagementSystem - Assignment 02 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
import React, { useState } from 'react';
import { LogIn, Key, Mail, AlertCircle, ArrowLeft, Shield, User } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginPage({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ Email');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập Mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email.trim(), password.trim());
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại Email và Mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <LogIn size={28} />
          </div>
          <h2 className="login-title">Đăng nhập hệ thống</h2>
          <p className="login-desc">Hệ thống Quản lý Tin tức FUNews Management System</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} /> Địa chỉ Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="VD: SteveParis@FUNewsManagement.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Key size={16} /> Mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="quick-test-section">
          <div className="quick-test-title">Tài khoản kiểm thử nhanh (Demo)</div>
          <div className="quick-test-buttons">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleQuickFill('SteveParis@FUNewsManagement.org', '@1')}
            >
              <Shield size={14} /> Điền nhanh Admin (Role 1)
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleQuickFill('EmmaWilliam@FUNewsManagement.org', '@1')}
            >
              <User size={14} /> Điền nhanh Staff (Role 2)
            </button>
          </div>
        </div>

        <div className="login-footer">
          <button type="button" className="btn btn-link btn-sm" onClick={onCancel}>
            <ArrowLeft size={16} /> Quay lại xem tin công khai (Khách)
          </button>
        </div>
      </div>
    </div>
  );
}
