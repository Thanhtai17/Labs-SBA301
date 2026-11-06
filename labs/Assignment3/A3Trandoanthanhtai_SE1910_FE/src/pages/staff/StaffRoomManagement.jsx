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
import { roomApi } from '../../api/roomApi';
import { Plus, Edit2, Trash2, Search, BedDouble, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const StaffRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeId: 1,
    roomStatus: 1,
    roomPricePerDay: 500000
  });

  // Delete dialog & Result alert
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionAlert, setActionAlert] = useState(null); // { type: 'success' | 'info' | 'error', message: '' }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAllRooms({
          keyword: keyword || undefined,
          roomTypeId: selectedType || undefined
        }),
        roomApi.getRoomTypes()
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
    } catch (err) {
      console.error(err);
      setActionAlert({
        type: 'error',
        message: err.message || 'Không thể tải danh sách phòng.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeId: roomTypes[0]?.roomTypeId || 1,
      roomStatus: 1,
      roomPricePerDay: 500000
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity || 2,
      roomTypeId: room.roomTypeId,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay
    });
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomApi.updateRoom(editingRoom.roomId, formData);
        setActionAlert({
          type: 'success',
          message: `Cập nhật thông tin phòng [${formData.roomNumber}] thành công!`
        });
      } else {
        await roomApi.createRoom(formData);
        setActionAlert({
          type: 'success',
          message: `Thêm mới phòng [${formData.roomNumber}] thành công!`
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setActionAlert({
        type: 'error',
        message: err.message || 'Có lỗi xảy ra khi lưu phòng.'
      });
    }
  };

  const confirmDelete = (room) => {
    setRoomToDelete(room);
  };

  const executeDelete = async () => {
    if (!roomToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await roomApi.deleteRoom(roomToDelete.roomId);
      // Backend returns message and action (HARD_DELETED or STATUS_DEACTIVATED)
      setActionAlert({
        type: res.data.action === 'HARD_DELETED' ? 'success' : 'info',
        message: res.data.message
      });
      setRoomToDelete(null);
      fetchData();
    } catch (err) {
      setActionAlert({
        type: 'error',
        message: err.message || 'Lỗi khi thực hiện xóa phòng.'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Quản lý thông tin Phòng (Staff - Room Management)
          </h1>
          <p style={{ color: '#64748b' }}>
            Xem danh sách, thêm mới, sửa, và thực hiện nghiệp vụ xóa/chuyển trạng thái phòng theo quy tắc đề bài
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Thêm phòng mới
        </button>
      </div>

      {/* Notice on Rule */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 10,
        padding: '0.85rem 1.15rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Quy tắc nghiệp vụ của đề bài:</strong> Khi bấm xóa phòng, hệ thống kiểm tra nếu phòng <em>chưa từng có giao dịch</em> sẽ xóa vĩnh viễn khỏi CSDL (Hard Delete). Nếu phòng <em>đã có giao dịch trong BookingDetail</em> thì chỉ đổi trạng thái sang ngưng hoạt động (RoomStatus = 0 / Soft Delete).
        </div>
      </div>

      {actionAlert && (
        <div style={{
          background: actionAlert.type === 'error' ? '#fee2e2' : actionAlert.type === 'info' ? '#eff6ff' : '#dcfce7',
          border: `1px solid ${actionAlert.type === 'error' ? '#fecaca' : actionAlert.type === 'info' ? '#bfdbfe' : '#bbf7d0'}`,
          color: actionAlert.type === 'error' ? '#b91c1c' : actionAlert.type === 'info' ? '#1e40af' : '#15803d',
          padding: '1rem 1.25rem',
          borderRadius: 10,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            {actionAlert.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{actionAlert.message}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="btn btn-secondary btn-sm"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Tìm theo số phòng, mô tả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Tất cả loại phòng</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">Tìm kiếm</button>
        </form>
      </div>

      {/* Rooms Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Số phòng</th>
              <th>Loại phòng</th>
              <th>Sức chứa</th>
              <th>Giá / ngày</th>
              <th>Trạng thái</th>
              <th>Mô tả chi tiết</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Đang tải danh sách phòng...</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Không tìm thấy phòng nào.</td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.roomId}>
                  <td style={{ fontWeight: 700 }}>#{r.roomId}</td>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{r.roomNumber}</td>
                  <td>
                    <span className="badge badge-primary">{r.roomTypeName}</span>
                  </td>
                  <td>{r.roomMaxCapacity} người</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>
                    {formatPrice(r.roomPricePerDay)}
                  </td>
                  <td>
                    {r.roomStatus === 1 ? (
                      <span className="badge badge-success">Hoạt động (1)</span>
                    ) : (
                      <span className="badge badge-danger">Ngưng HĐ (0)</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.roomDetailDescription || '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn btn-secondary btn-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => confirmDelete(r)}
                        className="btn btn-danger btn-sm"
                        title="Xóa phòng (Kiểm tra nghiệp vụ)"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? `Chỉnh sửa phòng [${editingRoom.roomNumber}]` : 'Thêm phòng mới'}
      >
        <form onSubmit={handleSaveRoom}>
          <div className="form-group">
            <label className="form-label">Số phòng (Room Number) *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="VD: STD-105, DLX-305..."
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Loại phòng (Room Type) *</label>
              <select
                className="form-select"
                value={formData.roomTypeId}
                onChange={(e) => setFormData({ ...formData, roomTypeId: Number(e.target.value) })}
              >
                {roomTypes.map((t) => (
                  <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sức chứa tối đa (Người)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={formData.roomMaxCapacity}
                onChange={(e) => setFormData({ ...formData, roomMaxCapacity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Giá thuê mỗi ngày (VNĐ) *</label>
              <input
                type="number"
                required
                min="0"
                step="50000"
                className="form-input"
                value={formData.roomPricePerDay}
                onChange={(e) => setFormData({ ...formData, roomPricePerDay: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái phòng</label>
              <select
                className="form-select"
                value={formData.roomStatus}
                onChange={(e) => setFormData({ ...formData, roomStatus: Number(e.target.value) })}
              >
                <option value={1}>1 - Hoạt động (Active)</option>
                <option value={0}>0 - Ngưng hoạt động (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả chi tiết phòng</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Tiện nghi phòng, hướng nhìn, ban công..."
              value={formData.roomDetailDescription}
              onChange={(e) => setFormData({ ...formData, roomDetailDescription: e.target.value })}
            />
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
              {editingRoom ? 'Lưu thay đổi' : 'Tạo phòng'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={executeDelete}
        title={`Xác nhận xóa phòng [${roomToDelete?.roomNumber}]`}
        message={`Bạn có chắc muốn xóa phòng ${roomToDelete?.roomNumber}? Hệ thống sẽ tự động kiểm tra lịch sử đặt phòng: nếu đã có giao dịch thì chuyển trạng thái sang ngưng hoạt động (Soft Delete), nếu chưa từng có giao dịch thì xóa vĩnh viễn (Hard Delete).`}
        confirmText="Xóa phòng"
        isDanger={true}
        loading={deleteLoading}
      />
    </div>
  );
};

export default StaffRoomManagement;

