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
import { Search, Filter, Calendar, User, Tag, BookOpen, AlertCircle } from 'lucide-react';
import { newsService, categoryService, tagService } from '../services/api';
import Modal from '../components/Modal';

export default function PublicNewsPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Article detail modal
  const [viewingArticle, setViewingArticle] = useState(null);

  useEffect(() => {
    loadMetadata();
    fetchNews();
  }, []);

  const loadMetadata = async () => {
    try {
      const [cats, tgs] = await Promise.all([
        categoryService.getAll(null, true),
        tagService.getAll()
      ]);
      setCategories(cats);
      setTags(tgs);
    } catch (err) {
      console.error('Failed to load metadata', err);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      // Only active news (status = true) for public
      const params = {
        status: true,
        keyword: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        tagId: selectedTag || undefined
      };
      const data = await newsService.getAll(params);
      setArticles(data);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách tin tức');
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
    setTimeout(() => {
      newsService.getAll({ status: true }).then(setArticles);
    }, 0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Cổng thông tin & Tin tức FU News</h2>
          <p className="page-desc">Khám phá các tin tức học thuật, hoạt động sinh viên và sự kiện mới nhất (Công khai - Không cần đăng nhập)</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="search-filter-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control search-field"
            placeholder="Tìm theo tiêu đề, tóm tắt hoặc nội dung tin tức..."
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
            <option value="">-- Tất cả Thẻ (Tag) --</option>
            {tags.map((t) => (
              <option key={t.tagId} value={t.tagId}>
                #{t.tagName}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary">
            <Filter size={16} /> Lọc tin
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleResetFilters}>
            Đặt lại
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Đang tải tin tức từ máy chủ...</div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>Hiện không tìm thấy bài viết nào phù hợp.</p>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((item) => (
            <div key={item.newsArticleId} className="news-card" onClick={() => setViewingArticle(item)}>
              <div className="news-card-header">
                <span className="category-pill">{item.categoryName || 'Tin tức'}</span>
                <span className="news-date">
                  <Calendar size={14} />
                  {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </span>
              </div>

              <h3 className="news-card-title">{item.newsTitle}</h3>
              <p className="news-card-headline">{item.headline}</p>

              <div className="news-card-footer">
                <span className="author-info">
                  <User size={14} /> {item.createdByName || 'Biên tập viên'}
                </span>
                <div className="tags-list">
                  {item.tags && item.tags.slice(0, 3).map((t) => (
                    <span key={t.tagId} className="tag-pill">
                      #{t.tagName}
                    </span>
                  ))}
                  {item.tags && item.tags.length > 3 && (
                    <span className="tag-pill">+{item.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
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
              <span>• Người đăng: <strong>{viewingArticle.createdByName || 'N/A'}</strong></span>
              <span>• Ngày đăng: {new Date(viewingArticle.createdDate).toLocaleString('vi-VN')}</span>
              {viewingArticle.newsSource && <span>• Nguồn: {viewingArticle.newsSource}</span>}
            </div>

            <h4 className="detail-headline">{viewingArticle.headline}</h4>

            <div className="detail-body">
              {viewingArticle.newsContent ? (
                viewingArticle.newsContent.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
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
    </div>
  );
}
