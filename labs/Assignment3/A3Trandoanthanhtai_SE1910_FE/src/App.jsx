/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/customer/BookingPage';
import BookingHistoryPage from './pages/customer/BookingHistoryPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import StaffRoomManagement from './pages/staff/StaffRoomManagement';
import StaffCustomerManagement from './pages/staff/StaffCustomerManagement';
import StaffBookingManagement from './pages/staff/StaffBookingManagement';

const MainLayout = () => {
  const { isAuthenticated, isStaff, isCustomer } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBookingRoom, setSelectedBookingRoom] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            setActiveTab={setActiveTab}
            setSelectedBookingRoom={setSelectedBookingRoom}
          />
        );

      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;

      case 'register':
        return <RegisterPage setActiveTab={setActiveTab} />;

      // Customer Area
      case 'customer-booking':
        if (!isAuthenticated) return <LoginPage setActiveTab={setActiveTab} />;
        return (
          <BookingPage
            setActiveTab={setActiveTab}
            preSelectedRoom={selectedBookingRoom}
          />
        );

      case 'customer-history':
        if (!isAuthenticated) return <LoginPage setActiveTab={setActiveTab} />;
        return <BookingHistoryPage />;

      case 'customer-profile':
        if (!isAuthenticated) return <LoginPage setActiveTab={setActiveTab} />;
        return <CustomerProfilePage />;

      // Staff Area
      case 'staff-rooms':
        if (!isAuthenticated || !isStaff) return <LoginPage setActiveTab={setActiveTab} />;
        return <StaffRoomManagement />;

      case 'staff-customers':
        if (!isAuthenticated || !isStaff) return <LoginPage setActiveTab={setActiveTab} />;
        return <StaffCustomerManagement />;

      case 'staff-bookings':
        if (!isAuthenticated || !isStaff) return <LoginPage setActiveTab={setActiveTab} />;
        return <StaffBookingManagement />;

      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;

