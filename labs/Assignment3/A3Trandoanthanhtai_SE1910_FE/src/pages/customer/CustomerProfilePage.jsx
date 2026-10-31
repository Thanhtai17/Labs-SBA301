import React, { useState, useEffect } from 'react';
import { customerApi } from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Calendar, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

const CustomerProfilePage = () => {
  const { updateProfileData } = useAuth();
  const [profile, setProfile] = useState({
    customerId: '',
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customerApi.getMyProfile();
        setProfile({
          customerId: res.data.customerId,
          customerFullName: res.data.customerFullName || '',
          telephone: res.data.telephone || '',
          emailAddress: res.data.emailAddress || '',
          customerBirthday: res.data.customerBirthday || '',
          password: ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin hồ sơ.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        customerFullName: profile.customerFullName,
        telephone: profile.telephone,
        customerBirthday: profile.customerBirthday || null,
        password: newPassword ? newPassword : null
      };

      await updateProfileData(payload);
      setMessage('Cập nhật hồ sơ cá nhân thành công!');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Đang tải hồ sơ cá nhân...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Hồ sơ cá nhân (Manage Profile)
        </h1>
        <p style={{ color: '#64748b' }}>
          Cập nhật thông tin tài khoản và mật khẩu của bạn
        </p>
      </div>

      <div className="card">
        {message && (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '0.85rem 1rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.85rem 1rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
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
            <label className="form-label">Email tài khoản</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="text"
                disabled
                className="form-input"
                value={profile.emailAddress}
                style={{ paddingLeft: '2.4rem', backgroundColor: '#f8fafc', color: '#64748b' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email đăng nhập không thể thay đổi</span>
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="text"
                required
                className="form-input"
                value={profile.customerFullName}
                onChange={(e) => setProfile({ ...profile, customerFullName: e.target.value })}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <input
                  type="tel"
                  className="form-input"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <input
                  type="date"
                  className="form-input"
                  value={profile.customerBirthday}
                  onChange={(e) => setProfile({ ...profile, customerBirthday: e.target.value })}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <label className="form-label">Đổi mật khẩu mới (Bỏ trống nếu không đổi)</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', height: 44 }}
          >
            {saving ? 'Đang lưu thay đổi...' : 'Lưu thông tin hồ sơ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;

