/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
import React, { useState, useEffect } from 'react';
import { customerApi } from '../../api/customerApi';
import { Plus, Edit2, UserX, Search, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const StaffCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: ''
  });

  // Deactivate dialog
  const [customerToDeactivate, setCustomerToDeactivate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAllCustomers({ keyword: keyword || undefined });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '',
      customerStatus: 1,
      password: 'Customer@123'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      customerFullName: cust.customerFullName || '',
      telephone: cust.telephone || '',
      emailAddress: cust.emailAddress || '',
      customerBirthday: cust.customerBirthday || '',
      customerStatus: cust.customerStatus,
      password: cust.password || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerApi.updateCustomer(editingCustomer.customerId, formData);
        setAlertMsg({ type: 'success', text: `Cáº­p nháº­t khÃ¡ch hÃ ng [${formData.customerFullName}] thÃ nh cÃ´ng!` });
      } else {
        await customerApi.createCustomer(formData);
        setAlertMsg({ type: 'success', text: `Táº¡o má»›i khÃ¡ch hÃ ng [${formData.customerFullName}] thÃ nh cÃ´ng!` });
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi lÆ°u khÃ¡ch hÃ ng.');
    }
  };

  const confirmDeactivate = (cust) => {
    setCustomerToDeactivate(cust);
  };

  const executeDeactivate = async () => {
    if (!customerToDeactivate) return;
    setActionLoading(true);
    try {
      await customerApi.deleteCustomer(customerToDeactivate.customerId);
      setAlertMsg({
        type: 'success',
        text: `ÄÃ£ chuyá»ƒn tÃ i khoáº£n khÃ¡ch hÃ ng [${customerToDeactivate.customerFullName}] sang ngÆ°ng hoáº¡t Ä‘á»™ng.`
      });
      setCustomerToDeactivate(null);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Lá»—i khi ngÆ°ng kÃ­ch hoáº¡t tÃ i khoáº£n.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Quáº£n lÃ½ khÃ¡ch hÃ ng (Staff - Customer Management)
          </h1>
          <p style={{ color: '#64748b' }}>
            Xem danh sÃ¡ch khÃ¡ch hÃ ng, cáº­p nháº­t thÃ´ng tin vÃ  kiá»ƒm soÃ¡t tráº¡ng thÃ¡i tÃ i khoáº£n
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> ThÃªm khÃ¡ch hÃ ng
        </button>
      </div>

      {alertMsg && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '0.85rem 1rem',
          borderRadius: 8,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <CheckCircle2 size={18} />
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="btn btn-secondary btn-sm">ÄÃ³ng</button>
        </div>
      )}

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="TÃ¬m theo há» tÃªn, email hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">TÃ¬m kiáº¿m</button>
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Há» vÃ  tÃªn</th>
              <th>Email</th>
              <th>Sá»‘ Ä‘iá»‡n thoáº¡i</th>
              <th>NgÃ y sinh</th>
              <th>Tráº¡ng thÃ¡i</th>
              <th style={{ textAlign: 'center' }}>HÃ nh Ä‘á»™ng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Äang táº£i danh sÃ¡ch...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>KhÃ´ng tÃ¬m tháº¥y khÃ¡ch hÃ ng nÃ o.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customerId}>
                  <td style={{ fontWeight: 700 }}>#{c.customerId}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.customerFullName}</td>
                  <td>{c.emailAddress}</td>
                  <td>{c.telephone || 'â€”'}</td>
                  <td>{c.customerBirthday || 'â€”'}</td>
                  <td>
                    {c.customerStatus === 1 ? (
                      <span className="badge badge-success">KÃ­ch hoáº¡t (1)</span>
                    ) : (
                      <span className="badge badge-danger">ÄÃ£ khÃ³a (0)</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(c)}
                        className="btn btn-secondary btn-sm"
                        title="Chá»‰nh sá»­a"
                      >
                        <Edit2 size={14} /> Sá»­a
                      </button>
                      {c.customerStatus === 1 && (
                        <button
                          onClick={() => confirmDeactivate(c)}
                          className="btn btn-danger btn-sm"
                          title="KhÃ³a tÃ i khoáº£n"
                        >
                          <UserX size={14} /> KhÃ³a
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? `Chá»‰nh sá»­a thÃ´ng tin [${editingCustomer.customerFullName}]` : 'ThÃªm khÃ¡ch hÃ ng má»›i'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Há» vÃ  tÃªn *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.customerFullName}
              onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email tÃ i khoáº£n *</label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Sá»‘ Ä‘iá»‡n thoáº¡i</label>
              <input
                type="tel"
                className="form-input"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">NgÃ y sinh</label>
              <input
                type="date"
                className="form-input"
                value={formData.customerBirthday}
                onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tráº¡ng thÃ¡i tÃ i khoáº£n</label>
              <select
                className="form-select"
                value={formData.customerStatus}
                onChange={(e) => setFormData({ ...formData, customerStatus: Number(e.target.value) })}
              >
                <option value={1}>1 - KÃ­ch hoáº¡t (Active)</option>
                <option value={0}>0 - VÃ´ hiá»‡u hÃ³a (Inactive)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Máº­t kháº©u</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nháº­p máº­t kháº©u"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Há»§y
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {editingCustomer ? 'LÆ°u thay Ä‘á»•i' : 'Táº¡o má»›i'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Dialog */}
      <ConfirmDialog
        isOpen={!!customerToDeactivate}
        onClose={() => setCustomerToDeactivate(null)}
        onConfirm={executeDeactivate}
        title="XÃ¡c nháº­n vÃ´ hiá»‡u hÃ³a tÃ i khoáº£n"
        message={`Báº¡n cÃ³ cháº¯c muá»‘n chuyá»ƒn tráº¡ng thÃ¡i tÃ i khoáº£n cá»§a khÃ¡ch hÃ ng [${customerToDeactivate?.customerFullName}] sang ngÆ°ng hoáº¡t Ä‘á»™ng (Status = 0)?`}
        confirmText="VÃ´ hiá»‡u hÃ³a"
        isDanger={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default StaffCustomerManagement;

