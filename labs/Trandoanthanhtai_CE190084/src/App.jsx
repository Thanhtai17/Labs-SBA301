/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: App.jsx - Root Component điều khiển Auth, Navigation và Dữ liệu chung
 */
import React, { useState, useEffect } from 'react';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_NEWS,
  DEFAULT_USERS,
  loadData,
  saveData,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoryManagement } from './pages/CategoryManagement';
import { NewsManagement } from './pages/NewsManagement';
import { UserManagement } from './pages/UserManagement';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  // 1. Quản lý trạng thái đăng nhập (Auth state)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('funews_currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // 2. Quản lý tab đang chọn (Navigation state)
  const [activeTab, setActiveTab] = useState('dashboard');

  // 3. Quản lý dữ liệu chính (Data state)
  const [categories, setCategories] = useState(() => loadData('categories', DEFAULT_CATEGORIES));
  const [news, setNews] = useState(() => loadData('news', DEFAULT_NEWS));
  const [users, setUsers] = useState(() => loadData('users', DEFAULT_USERS));

  // Tự động đồng bộ vào LocalStorage mỗi khi state thay đổi
  useEffect(() => {
    saveData('categories', categories);
  }, [categories]);

  useEffect(() => {
    saveData('news', news);
  }, [news]);

  useEffect(() => {
    saveData('users', users);
  }, [users]);

  // Xử lý Đăng nhập / Đăng xuất
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('funews_currentUser', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('funews_currentUser');
  };

  // Khôi phục dữ liệu gốc
  const handleResetData = () => {
    setCategories(DEFAULT_CATEGORIES);
    setNews(DEFAULT_NEWS);
    setUsers(DEFAULT_USERS);
    saveData('categories', DEFAULT_CATEGORIES);
    saveData('news', DEFAULT_NEWS);
    saveData('users', DEFAULT_USERS);
  };

  // === CRUD CATEGORY ===
  const handleAddCategory = (newCat) => {
    const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    setCategories([{ id: nextId, ...newCat }, ...categories]);
  };

  const handleUpdateCategory = (id, updatedData) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // === CRUD NEWS ===
  const handleAddNews = (newArticle) => {
    const nextId = news.length > 0 ? Math.max(...news.map((n) => n.id)) + 1 : 1;
    setNews([{ id: nextId, ...newArticle }, ...news]);
  };

  const handleUpdateNews = (id, updatedData) => {
    setNews(news.map((n) => (n.id === id ? { ...n, ...updatedData } : n)));
  };

  const handleDeleteNews = (id) => {
    setNews(news.filter((n) => n.id !== id));
  };

  // === CRUD USER ===
  const handleAddUser = (newUser) => {
    const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers([{ id: nextId, ...newUser }, ...users]);
  };

  const handleUpdateUser = (id, updatedData) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Nếu chưa đăng nhập -> Hiển thị trang Đăng nhập
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Chọn trang hiển thị theo activeTab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            categories={categories}
            news={news}
            users={users}
            onSelectTab={setActiveTab}
          />
        );
      case 'categories':
        return (
          <CategoryManagement
            categories={categories}
            onAdd={handleAddCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        );
      case 'news':
        return (
          <NewsManagement
            news={news}
            categories={categories}
            currentUser={currentUser}
            onAdd={handleAddNews}
            onUpdate={handleUpdateNews}
            onDelete={handleDeleteNews}
          />
        );
      case 'users':
        return (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onAdd={handleAddUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            counts={{ categories: categories.length, news: news.length, users: users.length }}
            onResetData={handleResetData}
          />
        );
      default:
        return (
          <DashboardPage
            categories={categories}
            news={news}
            users={users}
            onSelectTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="app-root">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-body">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={{ categories: categories.length, news: news.length, users: users.length }}
        />
        <main className="app-main-area">{renderCurrentPage()}</main>
      </div>
    </div>
  );
}
