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
        setAlertMsg({ type: 'success', text: `Cập nhật khách hàng [${formData.customerFullName}] thành công!` });
      } else {
        await customerApi.createCustomer(formData);
        setAlertMsg({ type: 'success', text: `Tạo mới khách hàng [${formData.customerFullName}] thành công!` });
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu khách hàng.');
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
        text: `Đã chuyển tài khoản khách hàng [${customerToDeactivate.customerFullName}] sang ngưng hoạt động.`
      });
      setCustomerToDeactivate(null);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi ngưng kích hoạt tài khoản.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Quản lý khách hàng (Staff - Customer Management)
          </h1>
          <p style={{ color: '#64748b' }}>
            Xem danh sách khách hàng, cập nhật thông tin và kiểm soát trạng thái tài khoản
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Thêm khách hàng
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
          <button onClick={() => setAlertMsg(null)} className="btn btn-secondary btn-sm">Đóng</button>
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
              placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Tìm kiếm</button>
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Đang tải danh sách...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Không tìm thấy khách hàng nào.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customerId}>
                  <td style={{ fontWeight: 700 }}>#{c.customerId}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.customerFullName}</td>
                  <td>{c.emailAddress}</td>
                  <td>{c.telephone || '—'}</td>
                  <td>{c.customerBirthday || '—'}</td>
                  <td>
                    {c.customerStatus === 1 ? (
                      <span className="badge badge-success">Kích hoạt (1)</span>
                    ) : (
                      <span className="badge badge-danger">Đã khóa (0)</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(c)}
                        className="btn btn-secondary btn-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={14} /> Sửa
                      </button>
                      {c.customerStatus === 1 && (
                        <button
                          onClick={() => confirmDeactivate(c)}
                          className="btn btn-danger btn-sm"
                          title="Khóa tài khoản"
                        >
                          <UserX size={14} /> Khóa
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
        title={editingCustomer ? `Chỉnh sửa thông tin [${editingCustomer.customerFullName}]` : 'Thêm khách hàng mới'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.customerFullName}
              onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email tài khoản *</label>
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
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                className="form-input"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
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
              <label className="form-label">Trạng thái tài khoản</label>
              <select
                className="form-select"
                value={formData.customerStatus}
                onChange={(e) => setFormData({ ...formData, customerStatus: Number(e.target.value) })}
              >
                <option value={1}>1 - Kích hoạt (Active)</option>
                <option value={0}>0 - Vô hiệu hóa (Inactive)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập mật khẩu"
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
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {editingCustomer ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Deactivate Dialog */}
      <ConfirmDialog
        isOpen={!!customerToDeactivate}
        onClose={() => setCustomerToDeactivate(null)}
        onConfirm={executeDeactivate}
        title="Xác nhận vô hiệu hóa tài khoản"
        message={`Bạn có chắc muốn chuyển trạng thái tài khoản của khách hàng [${customerToDeactivate?.customerFullName}] sang ngưng hoạt động (Status = 0)?`}
        confirmText="Vô hiệu hóa"
        isDanger={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default StaffCustomerManagement;

