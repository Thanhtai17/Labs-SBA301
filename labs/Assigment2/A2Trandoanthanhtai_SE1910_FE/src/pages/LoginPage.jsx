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
      setError('Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ Email');
      return;
    }
    if (!password.trim()) {
      setError('Vui lÃ²ng nháº­p Máº­t kháº©u');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email.trim(), password.trim());
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'ÄÄƒng nháº­p tháº¥t báº¡i. Vui lÃ²ng kiá»ƒm tra láº¡i Email vÃ  Máº­t kháº©u.');
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
          <h2 className="login-title">ÄÄƒng nháº­p há»‡ thá»‘ng</h2>
          <p className="login-desc">Há»‡ thá»‘ng Quáº£n lÃ½ Tin tá»©c FUNews Management System</p>
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
              <Mail size={16} /> Äá»‹a chá»‰ Email
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
              <Key size={16} /> Máº­t kháº©u
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Nháº­p máº­t kháº©u"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Äang xÃ¡c thá»±c...' : 'ÄÄƒng nháº­p'}
          </button>
        </form>

        <div className="quick-test-section">
          <div className="quick-test-title">TÃ i khoáº£n kiá»ƒm thá»­ nhanh (Demo)</div>
          <div className="quick-test-buttons">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleQuickFill('SteveParis@FUNewsManagement.org', '@1')}
            >
              <Shield size={14} /> Äiá»n nhanh Admin (Role 1)
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleQuickFill('EmmaWilliam@FUNewsManagement.org', '@1')}
            >
              <User size={14} /> Äiá»n nhanh Staff (Role 2)
            </button>
          </div>
        </div>

        <div className="login-footer">
          <button type="button" className="btn btn-link btn-sm" onClick={onCancel}>
            <ArrowLeft size={16} /> Quay láº¡i xem tin cÃ´ng khai (KhÃ¡ch)
          </button>
        </div>
      </div>
    </div>
  );
}

