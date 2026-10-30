/**
 * Project: FUNewsManagementSystem - Assignment 02 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
import React, { useState, useEffect } from 'react';
import { UserCheck, Mail, Key, User, Shield, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { profileService } from '../services/api';

export default function ProfilePage({ currentUser, onProfileUpdated }) {
  const [profile, setProfile] = useState({
    accountId: '',
    accountName: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.accountId) {
      loadProfile(currentUser.accountId);
    }
  }, [currentUser]);

  const loadProfile = async (id) => {
    try {
      setLoading(true);
      const data = await profileService.getById(id);
      setProfile(data);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'Không thể tải thông tin hồ sơ' });
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!profile.accountName.trim()) {
      errs.accountName = 'Họ và tên không được để trống';
    }
    if (!profile.accountEmail.trim()) {
      errs.accountEmail = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.accountEmail.trim())) {
      errs.accountEmail = 'Email không hợp lệ';
    }
    if (!profile.accountPassword.trim()) {
      errs.accountPassword = 'Mật khẩu không được để trống';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const updated = await profileService.update(profile.accountId, {
        accountName: profile.accountName.trim(),
        accountEmail: profile.accountEmail.trim(),
        accountRole: profile.accountRole,
        accountPassword: profile.accountPassword.trim()
      });
      setFeedback({ type: 'success', message: 'Cập nhật hồ sơ cá nhân thành công!' });
      setProfile(updated);
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-container"><div className="loading-state">Đang tải hồ sơ...</div></div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Hồ sơ cá nhân (My Profile)</h2>
          <p className="page-desc">Xem và cập nhật thông tin tài khoản Biên tập viên</p>
        </div>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>×</button>
        </div>
      )}

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mã tài khoản (Account ID)</label>
            <input
              type="text"
              className="form-control"
              value={`#${profile.accountId}`}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vai trò trong hệ thống</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`role-badge ${profile.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}>
                {profile.accountRole === 1 ? 'Quản trị viên (Admin)' : 'Biên tập viên (Staff)'}
              </span>
              <span className="text-muted" style={{ fontSize: '12px' }}>(Được cấp bởi Ban quản trị)</span>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label required">
              <User size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Họ và tên hiển thị
            </label>
            <input
              type="text"
              className={`form-control ${errors.accountName ? 'is-invalid' : ''}`}
              value={profile.accountName}
              onChange={(e) => setProfile({ ...profile, accountName: e.target.value })}
            />
            {errors.accountName && <span className="invalid-feedback">{errors.accountName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">
              <Mail size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Địa chỉ Email
            </label>
            <input
              type="email"
              className={`form-control ${errors.accountEmail ? 'is-invalid' : ''}`}
              value={profile.accountEmail}
              onChange={(e) => setProfile({ ...profile, accountEmail: e.target.value })}
            />
            {errors.accountEmail && <span className="invalid-feedback">{errors.accountEmail}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">
              <Key size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Mật khẩu đăng nhập
            </label>
            <input
              type="text"
              className={`form-control ${errors.accountPassword ? 'is-invalid' : ''}`}
              value={profile.accountPassword}
              onChange={(e) => setProfile({ ...profile, accountPassword: e.target.value })}
            />
            {errors.accountPassword && <span className="invalid-feedback">{errors.accountPassword}</span>}
          </div>

          <div className="modal-actions-right" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Đang lưu...' : 'Lưu cập nhật'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
