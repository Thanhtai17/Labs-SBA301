/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, KeyRound, Mail, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

const LoginPage = ({ setActiveTab }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.role === 'STAFF') {
        setActiveTab('staff-rooms');
      } else {
        setActiveTab('customer-booking');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={{ maxWidth: 440, margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: '#eff6ff',
            color: '#2563eb',
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Đăng nhập hệ thống</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Hệ thống hỗ trợ tài khoản Staff (properties) và Customer (database)
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="password"
                required
                className="form-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', height: 44 }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Chưa có tài khoản?{' '}
          <span
            onClick={() => setActiveTab('register')}
            style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
          >
            Đăng ký ngay
          </span>
        </div>

        {/* Demo Fast Logins */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            Tài khoản mẫu kiểm thử nhanh
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('admin@fuminhotel.com', 'Admin@123')}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <ShieldCheck size={16} color="#2563eb" />
              <span><strong>Staff Account:</strong> admin@fuminhotel.com (Admin@123)</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('customer@fuminhotel.com', 'Customer@123')}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <UserCheck size={16} color="#10b981" />
              <span><strong>Customer 1:</strong> customer@fuminhotel.com (Customer@123)</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('taitt@fuminhotel.com', '123456')}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <UserCheck size={16} color="#10b981" />
              <span><strong>Customer 2:</strong> taitt@fuminhotel.com (123456)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

