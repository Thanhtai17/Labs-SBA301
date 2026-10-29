/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: Sidebar.jsx - Menu điều hướng các khu vực quản lý
 */
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
