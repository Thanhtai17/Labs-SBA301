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
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import PublicNewsPage from './pages/PublicNewsPage';
import AccountManagementPage from './pages/AccountManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import NewsManagementPage from './pages/NewsManagementPage';
import NewsHistoryPage from './pages/NewsHistoryPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('FUNMS_A2_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const savedUser = localStorage.getItem('FUNMS_A2_USER');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return u.accountRole === 1 ? 'accounts' : 'news-mgmt';
      }
    } catch {}
    return 'public-news';
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('FUNMS_A2_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('FUNMS_A2_USER');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggingIn(false);
    if (user.accountRole === 1) {
      setCurrentTab('accounts');
    } else {
      setCurrentTab('news-mgmt');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('public-news');
    setIsLoggingIn(false);
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser((prev) => ({
      ...prev,
      accountName: updatedUser.accountName,
      accountEmail: updatedUser.accountEmail
    }));
  };

  if (isLoggingIn) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setIsLoggingIn(false)}
      />
    );
  }

  return (
    <div className="app-layout">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(tab) => {
          if (tab === 'login') {
            setIsLoggingIn(true);
          } else {
            setCurrentTab(tab);
          }
        }}
      />

      <div className="app-body">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentUser={currentUser}
        />

        <main className="app-content">
          {currentTab === 'public-news' && <PublicNewsPage />}

          {currentTab === 'accounts' && (
            currentUser && currentUser.accountRole === 1 ? (
              <AccountManagementPage />
            ) : (
              <div className="unauthorized-card">
                <h3>Không có quyền truy cập</h3>
                <p>Khu vực này yêu cầu quyền Quản trị viên (Admin - Role 1).</p>
              </div>
            )
          )}

          {currentTab === 'categories' && (
            currentUser && currentUser.accountRole === 2 ? (
              <CategoryManagementPage />
            ) : (
              <div className="unauthorized-card">
                <h3>Không có quyền truy cập</h3>
                <p>Khu vực này yêu cầu quyền Biên tập viên (Staff - Role 2).</p>
              </div>
            )
          )}

          {currentTab === 'news-mgmt' && (
            currentUser && currentUser.accountRole === 2 ? (
              <NewsManagementPage currentUser={currentUser} />
            ) : (
              <div className="unauthorized-card">
                <h3>Không có quyền truy cập</h3>
                <p>Khu vực này yêu cầu quyền Biên tập viên (Staff - Role 2).</p>
              </div>
            )
          )}

          {currentTab === 'my-history' && (
            currentUser && currentUser.accountRole === 2 ? (
              <NewsHistoryPage currentUser={currentUser} />
            ) : (
              <div className="unauthorized-card">
                <h3>Không có quyền truy cập</h3>
                <p>Khu vực này yêu cầu quyền Biên tập viên (Staff - Role 2).</p>
              </div>
            )
          )}

          {currentTab === 'my-profile' && (
            currentUser && currentUser.accountRole === 2 ? (
              <ProfilePage
                currentUser={currentUser}
                onProfileUpdated={handleProfileUpdated}
              />
            ) : (
              <div className="unauthorized-card">
                <h3>Không có quyền truy cập</h3>
                <p>Khu vực này yêu cầu quyền Biên tập viên (Staff - Role 2).</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
