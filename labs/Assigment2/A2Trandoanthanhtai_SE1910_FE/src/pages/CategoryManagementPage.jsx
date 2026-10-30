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
      setFeedback({ type: 'danger', message: err.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch chuyÃªn má»¥c' });
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
      errors.categoryName = 'TÃªn chuyÃªn má»¥c khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (formData.categoryName.length > 100) {
      errors.categoryName = 'TÃªn chuyÃªn má»¥c khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 100 kÃ½ tá»±';
    }

    if (!formData.categoryDescription.trim()) {
      errors.categoryDescription = 'MÃ´ táº£ chuyÃªn má»¥c khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (formData.categoryDescription.length > 250) {
      errors.categoryDescription = 'MÃ´ táº£ khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 250 kÃ½ tá»±';
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
        setFeedback({ type: 'success', message: `Cáº­p nháº­t chuyÃªn má»¥c #${formData.categoryId} thÃ nh cÃ´ng!` });
      } else {
        await categoryService.create(payload);
        setFeedback({ type: 'success', message: 'Táº¡o chuyÃªn má»¥c má»›i thÃ nh cÃ´ng!' });
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
      setFeedback({ type: 'success', message: `ÄÃ£ xÃ³a chuyÃªn má»¥c #${deletingCategory.categoryId} thÃ nh cÃ´ng.` });
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
          <h2 className="page-title">Quáº£n lÃ½ ChuyÃªn má»¥c (Category Management)</h2>
          <p className="page-desc">PhÃ¢n loáº¡i danh má»¥c tin bÃ i há»‡ thá»‘ng dÃ nh cho BiÃªn táº­p viÃªn (Staff - Role 2)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> ThÃªm chuyÃªn má»¥c má»›i
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
            placeholder="TÃ¬m theo TÃªn chuyÃªn má»¥c..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          TÃ¬m kiáº¿m
        </button>
        {searchTerm && (
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); fetchCategories(''); }}>
            Bá» lá»c
          </button>
        )}
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Äang táº£i danh sÃ¡ch chuyÃªn má»¥c...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <FolderTree size={48} />
            <p>KhÃ´ng tÃ¬m tháº¥y chuyÃªn má»¥c nÃ o.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th style={{ width: '220px' }}>TÃªn chuyÃªn má»¥c</th>
                  <th>MÃ´ táº£ chuyÃªn má»¥c</th>
                  <th style={{ width: '120px' }}>ChuyÃªn má»¥c cha</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Tráº¡ng thÃ¡i</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Thao tÃ¡c</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td className="font-semibold">#{cat.categoryId}</td>
                    <td><strong>{cat.categoryName}</strong></td>
                    <td className="text-muted">{cat.categoryDescription}</td>
                    <td>{cat.parentCategoryId ? `#${cat.parentCategoryId}` : 'â€”'}</td>
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
                          title="Sá»­a chuyÃªn má»¥c"
                          onClick={() => handleOpenEditModal(cat)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="XÃ³a chuyÃªn má»¥c"
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
        title={isEditing ? `Chá»‰nh sá»­a ChuyÃªn má»¥c #${formData.categoryId}` : 'ThÃªm má»›i ChuyÃªn má»¥c'}
        maxWidth="540px"
      >
        <form onSubmit={handleSaveCategory}>
          <div className="form-group">
            <label className="form-label required">TÃªn chuyÃªn má»¥c</label>
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
            <label className="form-label required">MÃ´ táº£ chuyÃªn má»¥c</label>
            <textarea
              className={`form-control ${formErrors.categoryDescription ? 'is-invalid' : ''}`}
              rows={3}
              placeholder="Nháº­p mÃ´ táº£ chuyÃªn má»¥c (tá»‘i Ä‘a 250 kÃ½ tá»±)"
              value={formData.categoryDescription}
              onChange={(e) => setFormData({ ...formData, categoryDescription: e.target.value })}
            />
            {formErrors.categoryDescription && <span className="invalid-feedback">{formErrors.categoryDescription}</span>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">ChuyÃªn má»¥c cha (Parent ID)</label>
              <select
                className="form-control"
                value={formData.parentCategoryId}
                onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
              >
                <option value="">-- KhÃ´ng cÃ³ chuyÃªn má»¥c cha --</option>
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
              <label className="form-label">Tráº¡ng thÃ¡i (IsActive)</label>
              <select
                className="form-control"
                value={formData.active ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === '1' })}
              >
                <option value="1">Active (KÃ­ch hoáº¡t - 1)</option>
                <option value="0">Inactive (Táº¯t - 0)</option>
              </select>
            </div>
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Há»§y bá»
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'LÆ°u thay Ä‘á»•i' : 'Táº¡o chuyÃªn má»¥c'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="XÃ¡c nháº­n xÃ³a chuyÃªn má»¥c"
        maxWidth="460px"
      >
        {deletingCategory && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a chuyÃªn má»¥c <strong>"{deletingCategory.categoryName}"</strong> (ID: #{deletingCategory.categoryId}) khÃ´ng?
            </p>
            <div className="alert alert-warning" style={{ fontSize: '13px' }}>
              <strong>Quy Ä‘á»‹nh nghiá»‡p vá»¥:</strong> Náº¿u chuyÃªn má»¥c nÃ y Ä‘ang chá»©a cÃ¡c bÃ i viáº¿t tin tá»©c trong há»‡ thá»‘ng, thao tÃ¡c xÃ³a sáº½ bá»‹ tá»« chá»‘i.
            </div>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingCategory(null)}>
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

