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
import { History, Calendar, Eye, CheckCircle2, XCircle, AlertCircle, BookOpen, Tag } from 'lucide-react';
import { newsService } from '../services/api';
import Modal from '../components/Modal';

export default function NewsHistoryPage({ currentUser }) {
  const [historyArticles, setHistoryArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.accountId) {
      fetchHistory();
    }
  }, [currentUser]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsService.getAll({ createdById: currentUser.accountId });
      setHistoryArticles(data);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử tin bài của bạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Lịch sử Tin bài đã đăng (My News History)</h2>
          <p className="page-desc">
            Theo dõi tất cả bài viết do tài khoản <strong>{currentUser?.accountName}</strong> (ID #{currentUser?.accountId}) khởi tạo
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card table-card">
        {loading ? (
          <div className="loading-state">Đang tải lịch sử bài viết của bạn...</div>
        ) : historyArticles.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>Bạn chưa khởi tạo bài viết tin tức nào trong hệ thống.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Mã tin</th>
                  <th>Tiêu đề & Tóm tắt</th>
                  <th style={{ width: '150px' }}>Chuyên mục</th>
                  <th style={{ width: '160px' }}>Ngày tạo</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Xem</th>
                </tr>
              </thead>
              <tbody>
                {historyArticles.map((item) => (
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
                    <td style={{ fontSize: '13px' }}>
                      <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : 'N/A'}
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
                      <button
                        type="button"
                        className="btn-action"
                        title="Xem chi tiết bài viết"
                        onClick={() => setViewingArticle(item)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
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
              <span>• Mã tin: #{viewingArticle.newsArticleId}</span>
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
    </div>
  );
}
