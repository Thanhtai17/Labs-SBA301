/**
 * Project: FUNewsManagementSystem - Assignment 02 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
import React from 'react';
import { Newspaper, FolderTree, Users, History, UserCheck, Eye } from 'lucide-react';

export default function Sidebar({ currentTab, onSelectTab, currentUser }) {
  const isAdmin = currentUser && currentUser.accountRole === 1;
  const isStaff = currentUser && currentUser.accountRole === 2;

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <div className="nav-group-title">KhÃ¡m phÃ¡</div>
        <button
          className={`nav-item ${currentTab === 'public-news' ? 'active' : ''}`}
          onClick={() => onSelectTab('public-news')}
        >
          <Eye size={18} />
          <span>Báº£n tin cÃ´ng khai</span>
        </button>

        {isAdmin && (
          <>
            <div className="nav-group-title">Quáº£n trá»‹ viÃªn (Admin)</div>
            <button
              className={`nav-item ${currentTab === 'accounts' ? 'active' : ''}`}
              onClick={() => onSelectTab('accounts')}
            >
              <Users size={18} />
              <span>Quáº£n lÃ½ tÃ i khoáº£n</span>
            </button>
          </>
        )}

        {isStaff && (
          <>
            <div className="nav-group-title">BiÃªn táº­p viÃªn (Staff)</div>
            <button
              className={`nav-item ${currentTab === 'categories' ? 'active' : ''}`}
              onClick={() => onSelectTab('categories')}
            >
              <FolderTree size={18} />
              <span>Quáº£n lÃ½ chuyÃªn má»¥c</span>
            </button>

            <button
              className={`nav-item ${currentTab === 'news-mgmt' ? 'active' : ''}`}
              onClick={() => onSelectTab('news-mgmt')}
            >
              <Newspaper size={18} />
              <span>Quáº£n lÃ½ tin bÃ i (News)</span>
            </button>

            <button
              className={`nav-item ${currentTab === 'my-history' ? 'active' : ''}`}
              onClick={() => onSelectTab('my-history')}
            >
              <History size={18} />
              <span>Lá»‹ch sá»­ tin Ä‘Ã£ Ä‘Äƒng</span>
            </button>

            <button
              className={`nav-item ${currentTab === 'my-profile' ? 'active' : ''}`}
              onClick={() => onSelectTab('my-profile')}
            >
              <UserCheck size={18} />
              <span>Há»“ sÆ¡ cÃ¡ nhÃ¢n</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}

