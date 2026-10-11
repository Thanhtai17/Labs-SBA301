// CategoryManagement.jsx - Quản lý Danh mục (CRUD + Tìm kiếm + Modal Popup)
import React, { useState } from 'react';
import { Modal } from '../components/Modal';

export const CategoryManagement = ({ categories, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Modal Create / Update
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' hoặc 'update'
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 1 });
  const [formError, setFormError] = useState('');

  // State quản lý Modal Xác nhận Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 1. Tìm kiếm không làm mất dữ liệu gốc
  const filteredList = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Mở modal Thêm mới
  const openCreateModal = () => {
    setFormMode('create');
    setCurrentId(null);
    setFormData({ name: '', description: '', status: 1 });
    setFormError('');
    setIsFormOpen(true);
  };

  // Mở modal Chỉnh sửa
  const openEditModal = (item) => {
    setFormMode('update');
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      status: Number(item.status),
    });
    setFormError('');
    setIsFormOpen(true);
  };

  // Xử lý Lưu form
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Tên danh mục không được để trống!');
      return;
    }

    if (formMode === 'create') {
      onAdd({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: Number(formData.status),
      });
    } else {
      onUpdate(currentId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: Number(formData.status),
      });
    }

    setIsFormOpen(false);
  };

  // Xử lý Xóa khi đã xác nhận
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Quản lý Chuyên mục</h2>
          <p>Danh sách các phân loại tin tức trong hệ thống</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + Thêm danh mục
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar-row">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm danh mục theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button type="button" className="btn-clear" onClick={() => setSearchTerm('')}>
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Bảng dữ liệu */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th style={{ width: '130px' }}>Trạng thái</th>
            <th style={{ width: '150px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-row">
                Không tìm thấy danh mục nào phù hợp.
              </td>
            </tr>
          ) : (
            filteredList.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.description || '—'}</td>
                <td>
                  <span className={`status-badge ${Number(item.status) === 1 ? 'status-active' : 'status-inactive'}`}>
                    {Number(item.status) === 1 ? 'Hoạt động' : 'Tạm dừng'}
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

      {/* Modal Thêm / Sửa */}
      <Modal
        isOpen={isFormOpen}
        title={formMode === 'create' ? 'Thêm mới Danh mục' : 'Chỉnh sửa Danh mục'}
        onClose={() => setIsFormOpen(false)}
      >
        {formError && <div className="alert-error">{formError}</div>}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="cat-name">Tên danh mục *</label>
            <input
              id="cat-name"
              type="text"
              value={formData.name}
              placeholder="Nhập tên chuyên mục..."
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFormError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cat-desc">Mô tả</label>
            <textarea
              id="cat-desc"
              rows="3"
              value={formData.description}
              placeholder="Nhập mô tả ngắn gọn..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cat-status">Trạng thái</label>
            <select
              id="cat-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            >
              <option value={1}>1 - Hoạt động</option>
              <option value={0}>0 - Tạm dừng</option>
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
              {formMode === 'create' ? 'Tạo mới' : 'Lưu cập nhật'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác nhận Xóa */}
      <Modal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa danh mục"
        onClose={() => setDeleteTarget(null)}
      >
        <p>
          Bạn có chắc chắn muốn xóa danh mục <strong>"{deleteTarget?.name}"</strong> (ID: #{deleteTarget?.id}) không?
        </p>
        <p className="text-warning">Thao tác này sẽ xóa bản ghi khỏi danh sách hiển thị.</p>
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
