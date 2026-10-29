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
      setFeedback({ type: 'danger', message: err.message || 'KhÃ´ng thá»ƒ táº£i thÃ´ng tin há»“ sÆ¡' });
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!profile.accountName.trim()) {
      errs.accountName = 'Há» vÃ  tÃªn khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    }
    if (!profile.accountEmail.trim()) {
      errs.accountEmail = 'Email khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.accountEmail.trim())) {
      errs.accountEmail = 'Email khÃ´ng há»£p lá»‡';
    }
    if (!profile.accountPassword.trim()) {
      errs.accountPassword = 'Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
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
      setFeedback({ type: 'success', message: 'Cáº­p nháº­t há»“ sÆ¡ cÃ¡ nhÃ¢n thÃ nh cÃ´ng!' });
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
    return <div className="page-container"><div className="loading-state">Äang táº£i há»“ sÆ¡...</div></div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Há»“ sÆ¡ cÃ¡ nhÃ¢n (My Profile)</h2>
          <p className="page-desc">Xem vÃ  cáº­p nháº­t thÃ´ng tin tÃ i khoáº£n BiÃªn táº­p viÃªn</p>
        </div>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>Ã—</button>
        </div>
      )}

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">MÃ£ tÃ i khoáº£n (Account ID)</label>
            <input
              type="text"
              className="form-control"
              value={`#${profile.accountId}`}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vai trÃ² trong há»‡ thá»‘ng</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`role-badge ${profile.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}>
                {profile.accountRole === 1 ? 'Quáº£n trá»‹ viÃªn (Admin)' : 'BiÃªn táº­p viÃªn (Staff)'}
              </span>
              <span className="text-muted" style={{ fontSize: '12px' }}>(ÄÆ°á»£c cáº¥p bá»Ÿi Ban quáº£n trá»‹)</span>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label required">
              <User size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Há» vÃ  tÃªn hiá»ƒn thá»‹
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
              Äá»‹a chá»‰ Email
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
              Máº­t kháº©u Ä‘Äƒng nháº­p
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
              <span>{saving ? 'Äang lÆ°u...' : 'LÆ°u cáº­p nháº­t'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

