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
      setError(err.message || 'KhÃ´ng thá»ƒ táº£i lá»‹ch sá»­ tin bÃ i cá»§a báº¡n');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Lá»‹ch sá»­ Tin bÃ i Ä‘Ã£ Ä‘Äƒng (My News History)</h2>
          <p className="page-desc">
            Theo dÃµi táº¥t cáº£ bÃ i viáº¿t do tÃ i khoáº£n <strong>{currentUser?.accountName}</strong> (ID #{currentUser?.accountId}) khá»Ÿi táº¡o
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
          <div className="loading-state">Äang táº£i lá»‹ch sá»­ bÃ i viáº¿t cá»§a báº¡n...</div>
        ) : historyArticles.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>Báº¡n chÆ°a khá»Ÿi táº¡o bÃ i viáº¿t tin tá»©c nÃ o trong há»‡ thá»‘ng.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>MÃ£ tin</th>
                  <th>TiÃªu Ä‘á» & TÃ³m táº¯t</th>
                  <th style={{ width: '150px' }}>ChuyÃªn má»¥c</th>
                  <th style={{ width: '160px' }}>NgÃ y táº¡o</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Tráº¡ng thÃ¡i</th>
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
                        title="Xem chi tiáº¿t bÃ i viáº¿t"
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
              <span>â€¢ MÃ£ tin: #{viewingArticle.newsArticleId}</span>
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
    </div>
  );
}

