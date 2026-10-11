// SettingsPage.jsx - Cài đặt hệ thống & Thông tin phiên làm việc
import React, { useState } from 'react';

export const SettingsPage = ({ currentUser, counts, onResetData }) => {
  const [resetMessage, setResetMessage] = useState('');

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu mẫu ban đầu không?')) {
      onResetData();
      setResetMessage('Đã khôi phục dữ liệu mẫu thành công!');
      setTimeout(() => setResetMessage(''), 3000);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Cài đặt Hệ thống</h2>
          <p>Thông tin tài khoản đăng nhập và quản lý dữ liệu lưu trữ</p>
        </div>
      </div>

      {resetMessage && <div className="alert-success">{resetMessage}</div>}

      <div className="settings-cards">
        {/* Card thông tin người dùng */}
        <div className="card-box">
          <h3>Thông tin Phiên đăng nhập</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Tài khoản:</span>
              <span className="info-value"><strong>{currentUser?.username}</strong></span>
            </div>
            <div className="info-item">
              <span className="info-label">Họ và tên:</span>
              <span className="info-value">{currentUser?.fullName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Vai trò:</span>
              <span className="info-value">
                {currentUser?.role === 1 ? 'Quản trị viên (Role 1)' : 'Biên tập viên (Role 2)'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Trạng thái:</span>
              <span className="info-value text-green">Đang hoạt động</span>
            </div>
          </div>
        </div>

        {/* Card quản lý dữ liệu */}
        <div className="card-box">
          <h3>Bộ nhớ Dữ liệu (LocalStorage)</h3>
          <p>
            Dữ liệu ứng dụng hiện tại đang được lưu cục bộ trong trình duyệt bằng <code>localStorage</code>.
          </p>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Số chuyên mục:</span>
              <span className="info-value">{counts.categories} mục</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số bài viết:</span>
              <span className="info-value">{counts.news} bài</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số người dùng:</span>
              <span className="info-value">{counts.users} tài khoản</span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="btn-danger"
              onClick={handleReset}
            >
              Khôi phục dữ liệu mẫu ban đầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
