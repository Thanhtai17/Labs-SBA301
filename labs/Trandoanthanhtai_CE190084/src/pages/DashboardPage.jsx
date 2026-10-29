/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: DashboardPage.jsx - Màn hình tổng quan thống kê
 */
import React from 'react';

export const DashboardPage = ({ categories, news, users, onSelectTab }) => {
  const activeNewsCount = news.filter((n) => Number(n.status) === 1).length;
  const activeCategoriesCount = categories.filter((c) => Number(c.status) === 1).length;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Tổng quan Hệ thống</h2>
        <p>Báo cáo tóm tắt các thực thể dữ liệu trong FUNews</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Chuyên mục</div>
          <div className="stat-desc">Đang hoạt động: {activeCategoriesCount}</div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-value">{news.length}</div>
          <div className="stat-label">Bài viết tin tức</div>
          <div className="stat-desc">Đã xuất bản: {activeNewsCount}</div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Người dùng hệ thống</div>
          <div className="stat-desc">
            Quản trị viên: {users.filter((u) => u.role === 1).length}
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h3>Bài viết mới nhất</h3>
          <button
            type="button"
            className="btn-link"
            onClick={() => onSelectTab('news')}
          >
            Xem tất cả bài viết &rarr;
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Tiêu đề bài viết</th>
              <th style={{ width: '150px' }}>Tác giả</th>
              <th style={{ width: '120px' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {news.slice(0, 4).map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td><strong>{item.title}</strong></td>
                <td>{item.createdBy}</td>
                <td>
                  <span className={`status-badge ${Number(item.status) === 1 ? 'status-active' : 'status-inactive'}`}>
                    {Number(item.status) === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
