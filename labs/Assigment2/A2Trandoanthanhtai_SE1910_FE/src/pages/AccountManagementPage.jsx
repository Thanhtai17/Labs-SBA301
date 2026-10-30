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
      setFeedback({ type: 'danger', message: err.message || 'Không thể tải danh sách tài khoản' });
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
      errors.accountName = 'Tên tài khoản không được để trống';
    } else if (formData.accountName.length > 100) {
      errors.accountName = 'Tên không được quá 100 ký tự';
    }

    if (!formData.accountEmail.trim()) {
      errors.accountEmail = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail.trim())) {
      errors.accountEmail = 'Định dạng email không hợp lệ';
    }

    if (!formData.accountPassword.trim()) {
      errors.accountPassword = 'Mật khẩu không được để trống';
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
        setFeedback({ type: 'success', message: `Cập nhật tài khoản #${formData.accountId} thành công!` });
      } else {
        await accountService.create({
          accountId: formData.accountId ? Number(formData.accountId) : undefined,
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountRole: Number(formData.accountRole),
          accountPassword: formData.accountPassword
        });
        setFeedback({ type: 'success', message: 'Tạo tài khoản mới thành công!' });
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
      setFeedback({ type: 'success', message: `Đã xóa tài khoản #${deletingAccount.accountId} thành công.` });
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
          <h2 className="page-title">Quản lý Tài khoản (Account Management)</h2>
          <p className="page-desc">Chức năng đặc quyền dành cho Quản trị viên (Admin - Role 1)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Thêm tài khoản mới
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>×</button>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo Tên tài khoản hoặc Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Tìm kiếm
        </button>
        {searchTerm && (
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); fetchAccounts(''); }}>
            Bỏ lọc
          </button>
        )}
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Đang tải dữ liệu tài khoản...</div>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>Không có tài khoản nào được tìm thấy.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Họ và tên</th>
                  <th>Email đăng nhập</th>
                  <th style={{ width: '130px' }}>Vai trò (Role)</th>
                  <th style={{ width: '120px' }}>Mật khẩu</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Thao tác</th>
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
                          title="Sửa tài khoản"
                          onClick={() => handleOpenEditModal(acc)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="Xóa tài khoản"
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
        title={isEditing ? `Chỉnh sửa Tài khoản #${formData.accountId}` : 'Thêm mới Tài khoản'}
        maxWidth="520px"
      >
        <form onSubmit={handleSaveAccount}>
          {!isEditing && (
            <div className="form-group">
              <label className="form-label">Mã tài khoản (Account ID - để trống để tự sinh)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Tự động sinh số tiếp theo nếu bỏ trống"
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label required">Họ và tên</label>
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
            <label className="form-label required">Vai trò (Role)</label>
            <select
              className="form-control"
              value={formData.accountRole}
              onChange={(e) => setFormData({ ...formData, accountRole: Number(e.target.value) })}
            >
              <option value={1}>Admin (Quản trị viên - Role 1)</option>
              <option value={2}>Staff (Biên tập viên - Role 2)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Mật khẩu</label>
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
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        title="Xác nhận xóa tài khoản"
        maxWidth="460px"
      >
        {deletingAccount && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn xóa tài khoản <strong>"{deletingAccount.accountName}"</strong> (ID: #{deletingAccount.accountId}) không?
            </p>
            <div className="alert alert-warning" style={{ fontSize: '13px' }}>
              <strong>Lưu ý nghiệp vụ:</strong> Nếu tài khoản này đã từng tạo bất kỳ bài viết tin tức nào, hệ thống sẽ ngăn chặn việc xóa theo quy định đề bài.
            </div>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingAccount(null)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                Xác nhận Xóa
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
