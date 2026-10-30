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
      setFeedback({ type: 'danger', message: err.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch tin tá»©c' });
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
      errors.newsTitle = 'TiÃªu Ä‘á» tin bÃ i khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (formData.newsTitle.length > 400) {
      errors.newsTitle = 'TiÃªu Ä‘á» khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 400 kÃ½ tá»±';
    }

    if (!formData.headline.trim()) {
      errors.headline = 'DÃ²ng tÃ³m táº¯t (Headline) khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng';
    } else if (formData.headline.length > 150) {
      errors.headline = 'Headline khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 150 kÃ½ tá»±';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Vui lÃ²ng chá»n chuyÃªn má»¥c';
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
        setFeedback({ type: 'success', message: `Cáº­p nháº­t tin bÃ i #${formData.newsArticleId} thÃ nh cÃ´ng!` });
      } else {
        await newsService.create(payload);
        setFeedback({ type: 'success', message: 'Táº¡o bÃ i viáº¿t tin tá»©c má»›i thÃ nh cÃ´ng!' });
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
      setFeedback({ type: 'success', message: `ÄÃ£ xÃ³a bÃ i viáº¿t #${deletingArticle.newsArticleId} thÃ nh cÃ´ng.` });
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
          <h2 className="page-title">Quáº£n lÃ½ Tin bÃ i (News Article Management)</h2>
          <p className="page-desc">Táº¡o má»›i, biÃªn táº­p, gÃ¡n tháº» vÃ  phÃ¢n phá»‘i tin bÃ i dÃ nh cho BiÃªn táº­p viÃªn (Staff - Role 2)</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Viáº¿t tin bÃ i má»›i
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedback.message}</span>
          <button type="button" className="close-alert-btn" onClick={() => setFeedback({ type: '', message: '' })}>Ã—</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-filter-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control search-field"
            placeholder="TÃ¬m theo tiÃªu Ä‘á», headline hoáº·c ná»™i dung..."
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
            <option value="">-- Táº¥t cáº£ ChuyÃªn má»¥c --</option>
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
            <option value="">-- Táº¥t cáº£ Tháº» --</option>
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
            <option value="">-- Táº¥t cáº£ Tráº¡ng thÃ¡i --</option>
            <option value="1">Active (KÃ­ch hoáº¡t)</option>
            <option value="0">Inactive (Báº£n nhÃ¡p)</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Lá»c tin
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleResetFilters}>
            Äáº·t láº¡i
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Äang táº£i danh sÃ¡ch tin bÃ i...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <Newspaper size={48} />
            <p>KhÃ´ng cÃ³ bÃ i viáº¿t nÃ o phÃ¹ há»£p vá»›i bá»™ lá»c hiá»‡n táº¡i.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th style={{ width: '280px' }}>TiÃªu Ä‘á» & TÃ³m táº¯t</th>
                  <th style={{ width: '140px' }}>ChuyÃªn má»¥c</th>
                  <th style={{ width: '180px' }}>Tháº» (Tags)</th>
                  <th style={{ width: '120px' }}>TÃ¡c giáº£</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Tráº¡ng thÃ¡i</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Thao tÃ¡c</th>
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
                          <span className="text-muted" style={{ fontSize: '12px' }}>KhÃ´ng cÃ³ tháº»</span>
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
                          title="Xem chi tiáº¿t"
                          onClick={() => setViewingArticle(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          title="Sá»­a tin bÃ i"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          title="XÃ³a tin bÃ i"
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
        title={isEditing ? `Chá»‰nh sá»­a Tin bÃ i #${formData.newsArticleId}` : 'Soáº¡n tháº£o Tin bÃ i má»›i'}
        maxWidth="720px"
      >
        <form onSubmit={handleSaveArticle}>
          <div className="form-group">
            <label className="form-label required">TiÃªu Ä‘á» bÃ i viáº¿t (News Title)</label>
            <input
              type="text"
              className={`form-control ${formErrors.newsTitle ? 'is-invalid' : ''}`}
              placeholder="VD: Há»™i tháº£o TrÃ­ tuá»‡ nhÃ¢n táº¡o vÃ  CÆ¡ há»™i nghá» nghiá»‡p 2026"
              value={formData.newsTitle}
              onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
            />
            {formErrors.newsTitle && <span className="invalid-feedback">{formErrors.newsTitle}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">DÃ²ng tÃ³m táº¯t (Headline)</label>
            <input
              type="text"
              className={`form-control ${formErrors.headline ? 'is-invalid' : ''}`}
              placeholder="TÃ³m táº¯t ngáº¯n gá»n trong 1-2 cÃ¢u Ä‘á»ƒ thu hÃºt ngÆ°á»i Ä‘á»c"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
            {formErrors.headline && <span className="invalid-feedback">{formErrors.headline}</span>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label required">ChuyÃªn má»¥c</label>
              <select
                className={`form-control ${formErrors.categoryId ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Chá»n chuyÃªn má»¥c --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && <span className="invalid-feedback">{formErrors.categoryId}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tráº¡ng thÃ¡i phÃ¡t hÃ nh</label>
              <select
                className="form-control"
                value={formData.newsStatus ? '1' : '0'}
                onChange={(e) => setFormData({ ...formData, newsStatus: e.target.value === '1' })}
              >
                <option value="1">Active (CÃ´ng khai cho ngÆ°á»i xem - 1)</option>
                <option value="0">Inactive (Báº£n nhÃ¡p / LÆ°u trá»¯ - 0)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nguá»“n tin tá»©c (News Source)</label>
            <input
              type="text"
              className="form-control"
              placeholder="VD: Ban Truyá»n thÃ´ng FU, VnExpress..."
              value={formData.newsSource}
              onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chá»n cÃ¡c Tháº» gáº¯n kÃ¨m (Tags)</label>
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
            <label className="form-label">Ná»™i dung chi tiáº¿t (News Content)</label>
            <textarea
              className="form-control"
              rows={6}
              placeholder="Nháº­p ná»™i dung Ä‘áº§y Ä‘á»§ cá»§a bÃ i viáº¿t táº¡i Ä‘Ã¢y..."
              value={formData.newsContent}
              onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
            />
          </div>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Há»§y bá»
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'LÆ°u thay Ä‘á»•i' : 'ÄÄƒng bÃ i viáº¿t'}
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
              <span>â€¢ NgÆ°á»i táº¡o: <strong>{viewingArticle.createdByName || 'N/A'}</strong></span>
              <span>â€¢ NgÃ y táº¡o: {new Date(viewingArticle.createdDate).toLocaleString('vi-VN')}</span>
              {viewingArticle.newsSource && <span>â€¢ Nguá»“n: {viewingArticle.newsSource}</span>}
            </div>

            <h4 className="detail-headline">{viewingArticle.headline}</h4>

            <div className="detail-body">
              {viewingArticle.newsContent ? (
                viewingArticle.newsContent.split('\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))
              ) : (
                <p>Ná»™i dung chi tiáº¿t chÆ°a Ä‘Æ°á»£c cáº­p nháº­t.</p>
              )}
            </div>

            {viewingArticle.tags && viewingArticle.tags.length > 0 && (
              <div className="detail-tags">
                <strong>Tháº» gáº¯n kÃ¨m: </strong>
                {viewingArticle.tags.map((t) => (
                  <span key={t.tagId} className="tag-pill">
                    <Tag size={12} /> {t.tagName}
                  </span>
                ))}
              </div>
            )}

            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setViewingArticle(null)}>
                ÄÃ³ng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingArticle}
        onClose={() => setDeletingArticle(null)}
        title="XÃ¡c nháº­n xÃ³a bÃ i viáº¿t tin tá»©c"
        maxWidth="460px"
      >
        {deletingArticle && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
              Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a bÃ i viáº¿t <strong>"{deletingArticle.newsTitle}"</strong> (MÃ£ tin: #{deletingArticle.newsArticleId}) khÃ´ng?
            </p>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Thao tÃ¡c nÃ y sáº½ gá»¡ bá» bÃ i viáº¿t khá»i há»‡ thá»‘ng cÃ¹ng toÃ n bá»™ liÃªn káº¿t tháº» gáº¯n kÃ¨m.
            </p>
            <div className="modal-actions-right" style={{ marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeletingArticle(null)}>
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

