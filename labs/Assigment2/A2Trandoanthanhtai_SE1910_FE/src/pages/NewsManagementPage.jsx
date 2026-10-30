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
import { Newspaper, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, CheckCircle, Tag, Eye } from 'lucide-react';
import { newsService, categoryService, tagService } from '../services/api';
import Modal from '../components/Modal';

export default function NewsManagementPage({ currentUser }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    newsArticleId: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryId: '',
    newsStatus: true,
    tagIds: []
  });
  const [formErrors, setFormErrors] = useState({});

  // View detail modal state
  const [viewingArticle, setViewingArticle] = useState(null);

  // Delete modal state
  const [deletingArticle, setDeletingArticle] = useState(null);

  useEffect(() => {
    loadMetadata();
    fetchNews();
  }, []);

  const loadMetadata = async () => {
    try {
      const [cats, tgs] = await Promise.all([
        categoryService.getAll(null, false),
        tagService.getAll()
      ]);
      setCategories(cats);
      setTags(tgs);
    } catch (err) {
      console.error('Metadata error', err);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        tagId: selectedTag || undefined,
        status: selectedStatus !== '' ? selectedStatus === '1' : undefined
      };
      const data = await newsService.getAll(params);
      setArticles(data);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message || 'Không thể tải danh sách tin tức' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedStatus('');
    setTimeout(() => {
      newsService.getAll({}).then(setArticles);
    }, 0);
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({
      newsArticleId: '',
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: 'FUNews Hub',
      categoryId: categories.length > 0 ? categories[0].categoryId : '',
      newsStatus: true,
      tagIds: []
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setIsEditing(true);
    setFormData({
      newsArticleId: article.newsArticleId,
      newsTitle: article.newsTitle,
      headline: article.headline,
      newsContent: article.newsContent || '',
      newsSource: article.newsSource || '',
      categoryId: article.categoryId,
      newsStatus: article.newsStatus ?? true,
      tagIds: article.tags ? article.tags.map((t) => t.tagId) : []
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const toggleTagSelection = (tagId) => {
    const exists = formData.tagIds.includes(tagId);
    if (exists) {
      setFormData({ ...formData, tagIds: formData.tagIds.filter((id) => id !== tagId) });
    } else {
      setFormData({ ...formData, tagIds: [...formData.tagIds, tagId] });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.newsTitle.trim()) {
      errors.newsTitle = 'Tiêu đề tin bài không được để trống';
    } else if (formData.newsTitle.length > 400) {
      errors.newsTitle = 'Tiêu đề không được vượt quá 400 ký tự';
    }

    if (!formData.headline.trim()) {
      errors.headline = 'Dòng tóm tắt (Headline) không được để trống';
    } else if (formData.headline.length > 150) {
      errors.headline = 'Headline không được vượt quá 150 ký tự';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Vui lòng chọn chuyên mục';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        newsArticleId: formData.newsArticleId || undefined,
        newsTitle: formData.newsTitle.trim(),
        headline: formData.headline.trim(),
        newsContent: formData.newsContent,
        newsSource: formData.newsSource,
        categoryId: Number(formData.categoryId),
        newsStatus: Boolean(formData.newsStatus),
        tagIds: formData.tagIds,
        accountId: currentUser ? currentUser.accountId : undefined
      };

      if (isEditing) {
        await newsService.update(formData.newsArticleId, payload);
        setFeedback({ type: 'success', message: `Cập nhật tin bài #${formData.newsArticleId} thành công!` });
      } else {
        await newsService.create(payload);
        setFeedback({ type: 'success', message: 'Tạo bài viết tin tức mới thành công!' });
      }
      setIsFormOpen(false);
      fetchNews();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingArticle) return;
    try {
      await newsService.delete(deletingArticle.newsArticleId);
      setFeedback({ type: 'success', message: `Đã xóa bài viết #${deletingArticle.newsArticleId} thành công.` });
      setDeletingArticle(null);
      fetchNews();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.message });
      setDeletingArticle(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Tin bài (News Article Management)</h2>
          <p className="page-desc">Tạo mới, biên tập, gán thẻ và phân phối tin bài dành cho Biên tập viên (Staff - Role 2)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Viết tin bài mới
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-filter-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Tìm theo tiêu đề, headline hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Tất cả Chuyên mục --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <select
            className="form-control"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">-- Tất cả Thẻ --</option>
            {tags.map((t) => (
              <option key={t.tagId} value={t.tagId}>
                #{t.tagName}
              </option>
            ))}
          </select>

          <select
            className="form-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">-- Tất cả Trạng thái --</option>
            <option value="1">Active (Kích hoạt)</option>
            <option value="0">Inactive (Bản nháp)</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Lọc tin
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleResetFilters}>
            Đặt lại
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Đang tải danh sách tin bài...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <Newspaper size={48} />
            <p>Không có bài viết nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th style={{ width: '280px' }}>Tiêu đề & Tóm tắt</th>
                  <th style={{ width: '140px' }}>Chuyên mục</th>
                  <th style={{ width: '180px' }}>Thẻ (Tags)</th>
                  <th style={{ width: '120px' }}>Tác giả</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((item) => (
                  <tr key={item.newsArticleId}>
                    <td className="font-semibold">#{item.newsArticleId}</td>
                    <td>
                      <div className="article-table-title" onClick={() => setViewingArticle(item)}>
                        {item.newsTitle}
                      </div>
                      <div className="article-table-headline">{item.headline}</div>
                    </td>
                    <td>
                      <span className="category-pill">{item.categoryName}</span>
                    </td>
                    <td>
                      <div className="tags-list">
                        {item.tags && item.tags.length > 0 ? (
                          item.tags.map((t) => (
                            <span key={t.tagId} className="tag-pill">
                              #{t.tagName}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted" style={{ fontSize: '12px' }}>Không có thẻ</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>
                      {item.createdByName || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${item.newsStatus ? 'status-active' : 'status-inactive'}`}>
                        {item.newsStatus ? (
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
                          className="btn-action"
                          title="Xem chi tiết"
                          onClick={() => setViewingArticle(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          title="Sửa tin bài"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="Xóa tin bài"
                          onClick={() => setDeletingArticle(item)}
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
        title={isEditing ? `Chỉnh sửa Tin bài #${formData.newsArticleId}` : 'Soạn thảo Tin bài mới'}
        maxWidth="720px"
      >
        <form onSubmit={handleSaveArticle}>
          <div className="form-group">
            <label className="form-label required">Tiêu đề bài viết (News Title)</label>
            <input
              type="text"
              className={`form-control ${formErrors.newsTitle ? 'is-invalid' : ''}`}
              placeholder="VD: Hội thảo Trí tuệ nhân tạo và Cơ hội nghề nghiệp 2026"
              value={formData.newsTitle}
              onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
            />
            {formErrors.newsTitle && <span className="invalid-feedback">{formErrors.newsTitle}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Dòng tóm tắt (Headline)</label>
            <input
              type="text"
              className={`form-control ${formErrors.headline ? 'is-invalid' : ''}`}
              placeholder="Tóm tắt ngắn gọn trong 1-2 câu để thu hút người đọc"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
            {formErrors.headline && <span className="invalid-feedback">{formErrors.headline}</span>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label required">Chuyên mục</label>
              <select
                className={`form-control ${formErrors.categoryId ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Chọn chuyên mục --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && <span className="invalid-feedback">{formErrors.categoryId}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Trạng thái phát hành</label>
              <select
                className="form-control"
                value={formData.newsStatus ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, newsStatus: e.target.value === '1' })}
              >
                <option value="1">Active (Công khai cho người xem - 1)</option>
                <option value="0">Inactive (Bản nháp / Lưu trữ - 0)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nguồn tin tức (News Source)</label>
            <input
              type="text"
              className="form-control"
              placeholder="VD: Ban Truyền thông FU, VnExpress..."
              value={formData.newsSource}
              onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chọn các Thẻ gắn kèm (Tags)</label>
            <div className="tag-checkbox-grid">
              {tags.map((t) => {
                const isSelected = formData.tagIds.includes(t.tagId);
                return (
                  <label
                    key={t.tagId}
                    className={`tag-checkbox-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTagSelection(t.tagId)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ display: 'none' }}
                    />
                    #{t.tagName}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung chi tiết (News Content)</label>
            <textarea
              className="form-control"
              rows={6}
              placeholder="Nhập nội dung đầy đủ của bài viết tại đây..."
              value={formData.newsContent}
              onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
            />
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Lưu thay đổi' : 'Đăng bài viết'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={!!viewingArticle}
        onClose={() => setViewingArticle(null)}
        title={viewingArticle ? viewingArticle.newsTitle : ''}
        maxWidth="750px"
      >
        {viewingArticle && (
          <div className="article-detail-content">
            <div className="detail-meta">
              <span className="category-pill">{viewingArticle.categoryName}</span>
              <span>• Người tạo: <strong>{viewingArticle.createdByName || 'N/A'}</strong></span>
              <span>• Ngày tạo: {new Date(viewingArticle.createdDate).toLocaleString('vi-VN')}</span>
              {viewingArticle.newsSource && <span>• Nguồn: {viewingArticle.newsSource}</span>}
            </div>

            <h4 className="detail-headline">{viewingArticle.headline}</h4>

            <div className="detail-body">
              {viewingArticle.newsContent ? (
                viewingArticle.newsContent.split('\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))
              ) : (
                <p>Nội dung chi tiết chưa được cập nhật.</p>
              )}
            </div>

            {viewingArticle.tags && viewingArticle.tags.length > 0 && (
              <div className="detail-tags">
                <strong>Thẻ gắn kèm: </strong>
                {viewingArticle.tags.map((t) => (
                  <span key={t.tagId} className="tag-pill">
                    <Tag size={12} /> {t.tagName}
                  </span>
                ))}
              </div>
            )}

            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setViewingArticle(null)}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingArticle}
        onClose={() => setDeletingArticle(null)}
        title="Xác nhận xóa bài viết tin tức"
        maxWidth="460px"
      >
        {deletingArticle && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{deletingArticle.newsTitle}"</strong> (Mã tin: #{deletingArticle.newsArticleId}) không?
            </p>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Thao tác này sẽ gỡ bỏ bài viết khỏi hệ thống cùng toàn bộ liên kết thẻ gắn kèm.
            </p>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingArticle(null)}>
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
