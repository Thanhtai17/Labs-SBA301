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
import { Users, Search, Plus, Edit2, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';
import { accountService } from '../services/api';
import Modal from '../components/Modal';

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    accountName: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirm modal state
  const [deletingAccount, setDeletingAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async (keyword = searchTerm) => {
    try {
      setLoading(true);
      const data = await accountService.getAll(keyword || undefined);
      setAccounts(data);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch tÃ i khoáº£n' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAccounts(searchTerm);
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({
      accountId: '',
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '@1'
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (acc) => {
    setIsEditing(true);
    setFormData({
      accountId: acc.accountId,
      accountName: acc.accountName,
      accountEmail: acc.accountEmail,
      accountRole: acc.accountRole,
      accountPassword: acc.accountPassword
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.accountName.trim()) {
      errors.accountName = 'TÃªn tÃ i khoáº£n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (formData.accountName.length > 100) {
      errors.accountName = 'TÃªn khÃ´ng Ä‘Æ°á»£c quÃ¡ 100 kÃ½ tá»±';
    }

    if (!formData.accountEmail.trim()) {
      errors.accountEmail = 'Email khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail.trim())) {
      errors.accountEmail = 'Äá»‹nh dáº¡ng email khÃ´ng há»£p lá»‡';
    }

    if (!formData.accountPassword.trim()) {
      errors.accountPassword = 'Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await accountService.update(formData.accountId, formData);
        setFeedback({ type: 'success', message: `Cáº­p nháº­t tÃ i khoáº£n #${formData.accountId} thÃ nh cÃ´ng!` });
      } else {
        await accountService.create({
          accountId: formData.accountId ? Number(formData.accountId) : undefined,
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountRole: Number(formData.accountRole),
          accountPassword: formData.accountPassword
        });
        setFeedback({ type: 'success', message: 'Táº¡o tÃ i khoáº£n má»›i thÃ nh cÃ´ng!' });
      }
      setIsFormOpen(false);
      fetchAccounts();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccount) return;
    try {
      await accountService.delete(deletingAccount.accountId);
      setFeedback({ type: 'success', message: `ÄÃ£ xÃ³a tÃ i khoáº£n #${deletingAccount.accountId} thÃ nh cÃ´ng.` });
      setDeletingAccount(null);
      fetchAccounts();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
      setDeletingAccount(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quáº£n lÃ½ TÃ i khoáº£n (Account Management)</h2>
          <p className="page-desc">Chá»©c nÄƒng Ä‘á»™c quyá»n dÃ nh cho Quáº£n trá»‹ viÃªn (Admin - Role 1)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> ThÃªm tÃ i khoáº£n má»›i
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>Ã—</button>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="TÃ¬m theo TÃªn tÃ i khoáº£n hoáº·c Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          TÃ¬m kiáº¿m
        </button>
        {searchTerm && (
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); fetchAccounts(''); }}>
            Bá» lá»c
          </button>
        )}
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Äang táº£i dá»¯ liá»‡u tÃ i khoáº£n...</div>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>KhÃ´ng cÃ³ tÃ i khoáº£n nÃ o Ä‘Æ°á»£c tÃ¬m tháº¥y.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Há» vÃ  tÃªn</th>
                  <th>Email Ä‘Äƒng nháº­p</th>
                  <th style={{ width: '130px' }}>Vai trÃ² (Role)</th>
                  <th style={{ width: '120px' }}>Máº­t kháº©u</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Thao tÃ¡c</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.accountId}>
                    <td className="font-semibold">#{acc.accountId}</td>
                    <td><strong>{acc.accountName}</strong></td>
                    <td>{acc.accountEmail}</td>
                    <td>
                      <span className={`role-badge ${acc.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}>
                        {acc.accountRole === 1 ? (
                          <><Shield size={12} style={{ display: 'inline', marginRight: '3px' }} /> Admin</>
                        ) : (
                          <><User size={12} style={{ display: 'inline', marginRight: '3px' }} /> Staff</>
                        )}
                      </span>
                    </td>
                    <td><code>{acc.accountPassword}</code></td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          title="Sá»­a tÃ i khoáº£n"
                          onClick={() => handleOpenEditModal(acc)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="XÃ³a tÃ i khoáº£n"
                          onClick={() => setDeletingAccount(acc)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Popup Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? `Chá»‰nh sá»­a TÃ i khoáº£n #${formData.accountId}` : 'ThÃªm má»›i TÃ i khoáº£n'}
        maxWidth="520px"
      >
        <form onSubmit={handleSaveAccount}>
          {!isEditing && (
            <div className="form-group">
              <label className="form-label">MÃ£ tÃ i khoáº£n (Account ID - Ä‘á»ƒ trá»‘ng Ä‘á»ƒ tá»± sinh)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Tá»± Ä‘á»™ng sinh sá»‘ tiáº¿p theo náº¿u bá» trá»‘ng"
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label required">Há» vÃ  tÃªn</label>
            <input
              type="text"
              className={`form-control ${formErrors.accountName ? 'is-invalid' : ''}`}
              placeholder="VD: Steve Paris"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            />
            {formErrors.accountName && <span className="invalid-feedback">{formErrors.accountName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Email</label>
            <input
              type="email"
              className={`form-control ${formErrors.accountEmail ? 'is-invalid' : ''}`}
              placeholder="VD: SteveParis@FUNewsManagement.org"
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
            />
            {formErrors.accountEmail && <span className="invalid-feedback">{formErrors.accountEmail}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Vai trÃ² (Role)</label>
            <select
              className="form-control"
              value={formData.accountRole}
              onChange={(e) => setFormData({ ...formData, accountRole: Number(e.target.value) })}
            >
              <option value={1}>Admin (Quáº£n trá»‹ viÃªn - Role 1)</option>
              <option value={2}>Staff (BiÃªn táº­p viÃªn - Role 2)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Máº­t kháº©u</label>
            <input
              type="text"
              className={`form-control ${formErrors.accountPassword ? 'is-invalid' : ''}`}
              placeholder="VD: @1"
              value={formData.accountPassword}
              onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
            />
            {formErrors.accountPassword && <span className="invalid-feedback">{formErrors.accountPassword}</span>}
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Há»§y bá»
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'LÆ°u thay Ä‘á»•i' : 'Táº¡o tÃ i khoáº£n'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        title="XÃ¡c nháº­n xÃ³a tÃ i khoáº£n"
        maxWidth="460px"
      >
        {deletingAccount && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a tÃ i khoáº£n <strong>"{deletingAccount.accountName}"</strong> (ID: #{deletingAccount.accountId}) khÃ´ng?
            </p>
            <div className="alert alert-warning" style={{ fontSize: '13px' }}>
              <strong>LÆ°u Ã½ nghiá»‡p vá»¥:</strong> Náº¿u tÃ i khoáº£n nÃ y Ä‘Ã£ tá»«ng táº¡o báº¥t ká»³ bÃ i viáº¿t tin tá»©c nÃ o, há»‡ thá»‘ng sáº½ ngÄƒn cháº·n viá»‡c xÃ³a theo quy Ä‘á»‹nh Ä‘á» bÃ i.
            </div>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingAccount(null)}>
                Há»§y bá»
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                XÃ¡c nháº­n XÃ³a
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

