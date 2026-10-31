/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
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
        setError(err.response?.data?.message || 'KhÃ´ng thá»ƒ táº£i thÃ´ng tin há»“ sÆ¡.');
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
      setMessage('Cáº­p nháº­t há»“ sÆ¡ cÃ¡ nhÃ¢n thÃ nh cÃ´ng!');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Cáº­p nháº­t tháº¥t báº¡i.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Äang táº£i há»“ sÆ¡ cÃ¡ nhÃ¢n...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Há»“ sÆ¡ cÃ¡ nhÃ¢n (Manage Profile)
        </h1>
        <p style={{ color: '#64748b' }}>
          Cáº­p nháº­t thÃ´ng tin tÃ i khoáº£n vÃ  máº­t kháº©u cá»§a báº¡n
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
            <label className="form-label">Email tÃ i khoáº£n</label>
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
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email Ä‘Äƒng nháº­p khÃ´ng thá»ƒ thay Ä‘á»•i</span>
          </div>

          <div className="form-group">
            <label className="form-label">Há» vÃ  tÃªn *</label>
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
              <label className="form-label">Sá»‘ Ä‘iá»‡n thoáº¡i</label>
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
              <label className="form-label">NgÃ y sinh</label>
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
            <label className="form-label">Äá»•i máº­t kháº©u má»›i (Bá» trá»‘ng náº¿u khÃ´ng Ä‘á»•i)</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="password"
                className="form-input"
                placeholder="Nháº­p máº­t kháº©u má»›i náº¿u muá»‘n thay Ä‘á»•i"
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
            {saving ? 'Äang lÆ°u thay Ä‘á»•i...' : 'LÆ°u thÃ´ng tin há»“ sÆ¡'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;

