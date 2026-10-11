// Sidebar.jsx - Menu điều hướng 5 khu vực quản lý
import React from 'react';

export const Sidebar = ({ activeTab, onSelectTab, counts }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Tổng quan (Dashboard)' },
    { key: 'categories', label: 'Quản lý Danh mục', count: counts.categories },
    { key: 'news', label: 'Quản lý Tin bài', count: counts.news },
    { key: 'users', label: 'Quản lý Người dùng', count: counts.users },
    { key: 'settings', label: 'Cài đặt hệ thống' },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-title">QUẢN TRỊ VIÊN</div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`menu-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onSelectTab(item.key)}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className="menu-badge">{item.count}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};
