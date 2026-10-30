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
import { FolderTree, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { categoryService } from '../services/api';
import Modal from '../components/Modal';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: null,
    categoryName: '',
    categoryDescription: '',
    parentCategoryId: '',
    active: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (keyword = searchTerm) => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(keyword || undefined);
      setCategories(data);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'Không thể tải danh sách chuyên mục' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCategories(searchTerm);
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({
      categoryId: null,
      categoryName: '',
      categoryDescription: '',
      parentCategoryId: '',
      active: true
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setIsEditing(true);
    setFormData({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      categoryDescription: cat.categoryDescription,
      parentCategoryId: cat.parentCategoryId || '',
      active: cat.active ?? true
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Tên chuyên mục không được để trống';
    } else if (formData.categoryName.length > 100) {
      errors.categoryName = 'Tên chuyên mục không được vượt quá 100 ký tự';
    }

    if (!formData.categoryDescription.trim()) {
      errors.categoryDescription = 'Mô tả chuyên mục không được để trống';
    } else if (formData.categoryDescription.length > 250) {
      errors.categoryDescription = 'Mô tả không được vượt quá 250 ký tự';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        categoryName: formData.categoryName.trim(),
        categoryDescription: formData.categoryDescription.trim(),
        parentCategoryId: formData.parentCategoryId ? Number(formData.parentCategoryId) : null,
        active: Boolean(formData.active)
      };

      if (isEditing) {
        await categoryService.update(formData.categoryId, payload);
        setFeedback({ type: 'success', message: `Cập nhật chuyên mục #${formData.categoryId} thành công!` });
      } else {
        await categoryService.create(payload);
        setFeedback({ type: 'success', message: 'Tạo chuyên mục mới thành công!' });
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await categoryService.delete(deletingCategory.categoryId);
      setFeedback({ type: 'success', message: `Đã xóa chuyên mục #${deletingCategory.categoryId} thành công.` });
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
      setDeletingCategory(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Chuyên mục (Category Management)</h2>
          <p className="page-desc">Phân loại danh mục tin bài hệ thống dành cho Biên tập viên (Staff - Role 2)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Thêm chuyên mục mới
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
            placeholder="Tìm theo Tên chuyên mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Tìm kiếm
        </button>
        {searchTerm && (
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); fetchCategories(''); }}>
            Bỏ lọc
          </button>
        )}
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Đang tải danh sách chuyên mục...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <FolderTree size={48} />
            <p>Không tìm thấy chuyên mục nào.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th style={{ width: '220px' }}>Tên chuyên mục</th>
                  <th>Mô tả chuyên mục</th>
                  <th style={{ width: '120px' }}>Chuyên mục cha</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td className="font-semibold">#{cat.categoryId}</td>
                    <td><strong>{cat.categoryName}</strong></td>
                    <td className="text-muted">{cat.categoryDescription}</td>
                    <td>{cat.parentCategoryId ? `#${cat.parentCategoryId}` : '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${cat.active ? 'status-active' : 'status-inactive'}`}>
                        {cat.active ? (
                          <><CheckCircle2 size={12} style={{ display: 'inline', marginRight: '3px' }} /> Active</>
                        ) : (
                          <><XCircle size={12} style={{ display: 'inline', marginRight: '3px' }} /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          title="Sửa chuyên mục"
                          onClick={() => handleOpenEditModal(cat)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="Xóa chuyên mục"
                          onClick={() => setDeletingCategory(cat)}
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
        title={isEditing ? `Chỉnh sửa Chuyên mục #${formData.categoryId}` : 'Thêm mới Chuyên mục'}
        maxWidth="540px"
      >
        <form onSubmit={handleSaveCategory}>
          <div className="form-group">
            <label className="form-label required">Tên chuyên mục</label>
            <input
              type="text"
              className={`form-control ${formErrors.categoryName ? 'is-invalid' : ''}`}
              placeholder="VD: Academic news"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
            {formErrors.categoryName && <span className="invalid-feedback">{formErrors.categoryName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Mô tả chuyên mục</label>
            <textarea
              className={`form-control ${formErrors.categoryDescription ? 'is-invalid' : ''}`}
              rows={3}
              placeholder="Nhập mô tả chuyên mục (tối đa 250 ký tự)"
              value={formData.categoryDescription}
              onChange={(e) => setFormData({ ...formData, categoryDescription: e.target.value })}
            />
            {formErrors.categoryDescription && <span className="invalid-feedback">{formErrors.categoryDescription}</span>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Chuyên mục cha (Parent ID)</label>
              <select
                className="form-control"
                value={formData.parentCategoryId}
                onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
              >
                <option value="">-- Không có chuyên mục cha --</option>
                {categories
                  .filter((c) => !isEditing || c.categoryId !== formData.categoryId)
                  .map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      #{c.categoryId} - {c.categoryName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Trạng thái (IsActive)</label>
              <select
                className="form-control"
                value={formData.active ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === '1' })}
              >
                <option value="1">Active (Kích hoạt - 1)</option>
                <option value="0">Inactive (Tắt - 0)</option>
              </select>
            </div>
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Lưu thay đổi' : 'Tạo chuyên mục'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Xác nhận xóa chuyên mục"
        maxWidth="460px"
      >
        {deletingCategory && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn xóa chuyên mục <strong>"{deletingCategory.categoryName}"</strong> (ID: #{deletingCategory.categoryId}) không?
            </p>
            <div className="alert alert-warning" style={{ fontSize: '13px' }}>
              <strong>Quy định nghiệp vụ:</strong> Nếu chuyên mục này đang chứa các bài viết tin tức trong hệ thống, thao tác xóa sẽ bị từ chối.
            </div>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingCategory(null)}>
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
