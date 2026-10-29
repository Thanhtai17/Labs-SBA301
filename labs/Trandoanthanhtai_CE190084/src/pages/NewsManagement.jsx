/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: NewsManagement.jsx - Quản lý Tin bài (CRUD + Tìm kiếm + Liên kết Category)
 */
import React, { useState } from 'react';
import { Modal } from '../components/Modal';

export const NewsManagement = ({ news, categories, currentUser, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal Create / Update
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: categories[0]?.id || 1,
    status: 1,
  });
  const [formError, setFormError] = useState('');

  // State Modal Xác nhận Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Tra cứu tên danh mục theo categoryId
  const getCategoryName = (catId) => {
    const found = categories.find((c) => c.id === Number(catId));
    return found ? found.name : `Chuyên mục #${catId}`;
  };

  // Tìm kiếm theo Tiêu đề bài viết
  const filteredList = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Mở modal Thêm mới
  const openCreateModal = () => {
    setFormMode('create');
    setCurrentId(null);
    setFormData({
      title: '',
      content: '',
      categoryId: categories[0]?.id || 1,
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
      title: item.title,
      content: item.content || '',
      categoryId: Number(item.categoryId),
      status: Number(item.status),
    });
    setFormError('');
    setIsFormOpen(true);
  };

  // Xử lý Lưu
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Tiêu đề bài viết không được để trống!');
      return;
    }

    if (formMode === 'create') {
      onAdd({
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: Number(formData.categoryId),
        createdBy: currentUser?.username || 'Admin',
        status: Number(formData.status),
      });
    } else {
      onUpdate(currentId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: Number(formData.categoryId),
        status: Number(formData.status),
      });
    }

    setIsFormOpen(false);
  };

  // Xử lý Xóa sau khi confirm
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
          <h2>Quản lý Tin bài</h2>
          <p>Danh sách các bài viết tin tức và bài phân tích</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + Viết bài mới
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar-row">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bài viết theo tiêu đề..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button type="button" className="btn-clear" onClick={() => setSearchTerm('')}>
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Bảng tin bài */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>Tiêu đề bài viết</th>
            <th style={{ width: '160px' }}>Chuyên mục</th>
            <th style={{ width: '130px' }}>Tác giả</th>
            <th style={{ width: '120px' }}>Trạng thái</th>
            <th style={{ width: '150px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-row">
                Không tìm thấy bài viết nào phù hợp.
              </td>
            </tr>
          ) : (
            filteredList.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <strong>{item.title}</strong>
                  {item.content && (
                    <div className="table-subtext">{item.content.slice(0, 75)}...</div>
                  )}
                </td>
                <td>
                  <span className="badge-category">{getCategoryName(item.categoryId)}</span>
                </td>
                <td>{item.createdBy}</td>
                <td>
                  <span className={`status-badge ${Number(item.status) === 1 ? 'status-active' : 'status-inactive'}`}>
                    {Number(item.status) === 1 ? 'Hoạt động' : 'Tạm ẩn'}
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

      {/* Modal Thêm / Sửa Tin bài */}
      <Modal
        isOpen={isFormOpen}
        title={formMode === 'create' ? 'Tạo mới Tin bài' : 'Chỉnh sửa Tin bài'}
        onClose={() => setIsFormOpen(false)}
      >
        {formError && <div className="alert-error">{formError}</div>}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="news-title">Tiêu đề bài viết *</label>
            <input
              id="news-title"
              type="text"
              value={formData.title}
              placeholder="Nhập tiêu đề..."
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setFormError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-category">Chuyên mục (Category) *</label>
            <select
              id="news-category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="news-content">Nội dung bài viết</label>
            <textarea
              id="news-content"
              rows="4"
              value={formData.content}
              placeholder="Nhập nội dung chi tiết..."
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-status">Trạng thái xuất bản</label>
            <select
              id="news-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            >
              <option value={1}>1 - Đã xuất bản (Hoạt động)</option>
              <option value={0}>0 - Bản nháp (Tạm ẩn)</option>
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
              {formMode === 'create' ? 'Tạo bài viết' : 'Lưu cập nhật'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác nhận Xóa */}
      <Modal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa bài viết"
        onClose={() => setDeleteTarget(null)}
      >
        <p>
          Bạn có chắc chắn muốn xóa bài viết <strong>"{deleteTarget?.title}"</strong> (ID: #{deleteTarget?.id}) không?
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
