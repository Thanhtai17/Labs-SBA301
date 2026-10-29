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
import { LogOut, User, LogIn, Shield, Edit3 } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Header({ currentUser, onLogout, onNavigate }) {
  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => onNavigate('public-news')} style={{ cursor: 'pointer' }}>
        <img src={logoImg} alt="FUNews Logo" className="header-logo" />
        <div>
          <h1 className="header-title">FUNews Management System</h1>
          <span className="header-subtitle">Assignment 02 - RESTful Web Service & React</span>
        </div>
      </div>

      <div className="header-actions">
        {currentUser ? (
          <div className="user-profile-bar">
            <div className="user-info">
              <span className="user-name">
                <User size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {currentUser.accountName}
              </span>
              <span className={`role-badge ${currentUser.accountRole === 1 ? 'badge-admin' : 'badge-staff'}`}>
                {currentUser.accountRole === 1 ? (
                  <><Shield size={12} style={{ display: 'inline', marginRight: '2px' }} /> Admin</>
                ) : (
                  <><Edit3 size={12} style={{ display: 'inline', marginRight: '2px' }} /> Staff</>
                )}
              </span>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
              <LogOut size={16} />
              <span>ÄÄƒng xuáº¥t</span>
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('login')}>
            <LogIn size={16} />
            <span>ÄÄƒng nháº­p há»‡ thá»‘ng</span>
          </button>
        )}
      </div>
    </header>
  );
}

