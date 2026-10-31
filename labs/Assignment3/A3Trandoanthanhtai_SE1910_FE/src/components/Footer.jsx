import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      color: '#64748b',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            FU Mini Hotel Management System (FUMiniHotelSystem)
          </div>
          <div>Assignment 03 SBA301 - Securing REST Services with Spring Boot 3 & ReactJS</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div><strong>Sinh viên thực hiện:</strong> Tran Doan Thanh Tai (SE1910)</div>
          <div><strong>Database:</strong> A3Trandoanthanhtai_SE1910 (MS SQL Server)</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

