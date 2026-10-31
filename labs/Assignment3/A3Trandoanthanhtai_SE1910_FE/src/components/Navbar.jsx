import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Hotel,
  CalendarCheck,
  History,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
  BedDouble,
  Users,
  LayoutDashboard
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, isStaff, isCustomer, logout } = useAuth();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            color: 'white',
            padding: '0.55rem',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hotel size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
              FU Mini Hotel
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              FUMiniHotelSystem • SBA301
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'home' ? '#eff6ff' : 'transparent',
              color: activeTab === 'home' ? '#2563eb' : '#475569',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <BedDouble size={16} />
            Browse Rooms
          </button>

          {/* Customer Specific Tabs */}
          {isAuthenticated && isCustomer && (
            <>
              <button
                onClick={() => setActiveTab('customer-booking')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'customer-booking' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'customer-booking' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <CalendarCheck size={16} />
                Book Online
              </button>
              <button
                onClick={() => setActiveTab('customer-history')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'customer-history' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'customer-history' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <History size={16} />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('customer-profile')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'customer-profile' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'customer-profile' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <User size={16} />
                Profile
              </button>
            </>
          )}

          {/* Staff Specific Tabs */}
          {isAuthenticated && isStaff && (
            <>
              <button
                onClick={() => setActiveTab('staff-rooms')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'staff-rooms' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'staff-rooms' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <BedDouble size={16} />
                Manage Rooms
              </button>
              <button
                onClick={() => setActiveTab('staff-customers')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'staff-customers' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'staff-customers' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Users size={16} />
                Manage Customers
              </button>
              <button
                onClick={() => setActiveTab('staff-bookings')}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'staff-bookings' ? '#eff6ff' : 'transparent',
                  color: activeTab === 'staff-bookings' ? '#2563eb' : '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <CalendarCheck size={16} />
                Manage Bookings
              </button>
            </>
          )}
        </nav>

        {/* User Auth Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  {user.fullName || user.email}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <span className={`badge ${isStaff ? 'badge-primary' : 'badge-success'}`}>
                    {isStaff ? 'STAFF (Admin)' : 'CUSTOMER'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Đăng xuất"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444' }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('login')}
                className="btn btn-secondary btn-sm"
              >
                <LogIn size={15} />
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="btn btn-primary btn-sm"
              >
                <UserPlus size={15} />
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

