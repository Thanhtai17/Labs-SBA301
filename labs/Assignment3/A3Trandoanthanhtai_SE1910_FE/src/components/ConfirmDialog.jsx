/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "XÃ¡c nháº­n hÃ nh Ä‘á»™ng",
  message,
  confirmText = "XÃ¡c nháº­n",
  cancelText = "Há»§y bá»",
  isDanger = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={440}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{
          background: isDanger ? '#fee2e2' : '#fef3c7',
          color: isDanger ? '#dc2626' : '#d97706',
          padding: '0.65rem',
          borderRadius: '50%',
          display: 'flex'
        }}>
          <AlertTriangle size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem'
      }}>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} btn-sm`}
          disabled={loading}
        >
          {loading ? 'Äang xá»­ lÃ½...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

