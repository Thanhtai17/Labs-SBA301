/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: UserManagement.jsx - Quản lý Người dùng & Phân quyền (Role 1: Admin, 2: Staff)
 */
import React, { useState } from 'react';
import { Modal } from '../components/Modal';

export const UserManagement = ({ users, currentUser, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal Create / Update
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 2,
    status: 1,
  });
  const [formError, setFormError] = useState('');

  // State Modal Xác nhận Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Tìm kiếm theo Username hoặc Tên hoặc Email
  const filteredList = users.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  // Mở modal Thêm mới
  const openCreateModal = () => {
    setFormMode('create');
    setCurrentId(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 2,
      status: 1,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  // Mở modal Sửa
  const openEditModal = (item) => {
    setFormMode('update');
    setCurrentId(item.id);
    setFormData({
      username: item.username,
      fullName: item.fullName || '',
      email: item.email || '',
      role: Number(item.role),
      status: Number(item.status),
    });
    setFormError('');
    setIsFormOpen(true);
  };

  // Xử lý Lưu
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError('Tên tài khoản (Username) không được để trống!');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Email không hợp lệ (cần chứa ký tự @)!');
      return;
    }

    if (formMode === 'create') {
      // Kiểm tra trùng username
      const exists = users.some(
        (u) => u.username.toLowerCase() === formData.username.trim().toLowerCase()
      );
      if (exists) {
        setFormError('Tên tài khoản này đã tồn tại trong hệ thống!');
        return;
      }

      onAdd({
        username: formData.username.trim(),
        fullName: formData.fullName.trim() || formData.username.trim(),
        email: formData.email.trim(),
        role: Number(formData.role),
        status: Number(formData.status),
      });
    } else {
      onUpdate(currentId, {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: Number(formData.role),
        status: Number(formData.status),
      });
    }

    setIsFormOpen(false);
  };

  // Xử lý Xóa sau khi confirm
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.username === currentUser?.username) {
        alert('Không thể tự xóa tài khoản đang đăng nhập!');
        setDeleteTarget(null);
        return;
      }
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Quản lý Người dùng</h2>
          <p>Phân quyền quản trị và danh sách tài khoản biên tập</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + Thêm người dùng
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar-row">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo username, tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button type="button" className="btn-clear" onClick={() => setSearchTerm('')}>
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Bảng người dùng */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>Tài khoản (Username)</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th style={{ width: '130px' }}>Vai trò</th>
            <th style={{ width: '120px' }}>Trạng thái</th>
            <th style={{ width: '150px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-row">
                Không tìm thấy người dùng nào phù hợp.
              </td>
            </tr>
          ) : (
            filteredList.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td><strong>{item.username}</strong></td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>
                  <span className={`role-badge ${Number(item.role) === 1 ? 'role-admin' : 'role-staff'}`}>
                    {Number(item.role) === 1 ? 'Admin (Role 1)' : 'Staff (Role 2)'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${Number(item.status) === 1 ? 'status-active' : 'status-inactive'}`}>
                    {Number(item.status) === 1 ? 'Hoạt động' : 'Khóa'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-action btn-edit"
                    onClick={() => openEditModal(item)}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-delete"
                    onClick={() => setDeleteTarget(item)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Thêm / Sửa Người dùng */}
      <Modal
        isOpen={isFormOpen}
        title={formMode === 'create' ? 'Thêm mới Tài khoản' : 'Chỉnh sửa Tài khoản'}
        onClose={() => setIsFormOpen(false)}
      >
        {formError && <div className="alert-error">{formError}</div>}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="user-username">Tên đăng nhập (Username) *</label>
            <input
              id="user-username"
              type="text"
              value={formData.username}
              placeholder="Nhập username..."
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setFormError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-fullname">Họ và tên</label>
            <input
              id="user-fullname"
              type="text"
              value={formData.fullName}
              placeholder="Nhập họ và tên đầy đủ..."
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-email">Địa chỉ Email *</label>
            <input
              id="user-email"
              type="email"
              value={formData.email}
              placeholder="ví dụ: user@funews.edu.vn"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setFormError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-role">Phân quyền vai trò</label>
            <select
              id="user-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
            >
              <option value={1}>1 - Quản trị viên (Admin)</option>
              <option value={2}>2 - Biên tập viên (Staff)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user-status">Trạng thái tài khoản</label>
            <select
              id="user-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            >
              <option value={1}>1 - Đang hoạt động</option>
              <option value={0}>0 - Tạm khóa</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsFormOpen(false)}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary">
              {formMode === 'create' ? 'Tạo tài khoản' : 'Lưu cập nhật'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác nhận Xóa */}
      <Modal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa tài khoản"
        onClose={() => setDeleteTarget(null)}
      >
        <p>
          Bạn có chắc chắn muốn xóa người dùng <strong>"{deleteTarget?.username}"</strong> (ID: #{deleteTarget?.id}) không?
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleConfirmDelete}
          >
            Xác nhận xóa
          </button>
        </div>
      </Modal>
    </div>
  );
};
