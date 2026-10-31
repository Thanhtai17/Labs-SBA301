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
          message: `Cáº­p nháº­t thÃ´ng tin phÃ²ng [${formData.roomNumber}] thÃ nh cÃ´ng!`
        });
      } else {
        await roomApi.createRoom(formData);
        setActionAlert({
          type: 'success',
          message: `ThÃªm má»›i phÃ²ng [${formData.roomNumber}] thÃ nh cÃ´ng!`
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi lÆ°u phÃ²ng.');
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
        message: err.response?.data?.message || 'Lá»—i khi thá»±c hiá»‡n xÃ³a phÃ²ng.'
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
            Quáº£n lÃ½ thÃ´ng tin PhÃ²ng (Staff - Room Management)
          </h1>
          <p style={{ color: '#64748b' }}>
            Xem danh sÃ¡ch, thÃªm má»›i, sá»­a, vÃ  thá»±c hiá»‡n nghiá»‡p vá»¥ xÃ³a/chuyá»ƒn tráº¡ng thÃ¡i phÃ²ng theo quy táº¯c Ä‘á» bÃ i
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> ThÃªm phÃ²ng má»›i
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
          <strong>Quy táº¯c nghiá»‡p vá»¥ cá»§a Ä‘á» bÃ i:</strong> Khi báº¥m xÃ³a phÃ²ng, há»‡ thá»‘ng kiá»ƒm tra náº¿u phÃ²ng <em>chÆ°a tá»«ng cÃ³ giao dá»‹ch</em> sáº½ xÃ³a vÄ©nh viá»…n khá»i CSDL (Hard Delete). Náº¿u phÃ²ng <em>Ä‘Ã£ cÃ³ giao dá»‹ch trong BookingDetail</em> thÃ¬ chá»‰ Ä‘á»•i tráº¡ng thÃ¡i sang ngÆ°ng hoáº¡t Ä‘á»™ng (RoomStatus = 0 / Soft Delete).
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
            ÄÃ³ng
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
              placeholder="TÃ¬m theo sá»‘ phÃ²ng, mÃ´ táº£..."
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
              <option value="">Táº¥t cáº£ loáº¡i phÃ²ng</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">TÃ¬m kiáº¿m</button>
        </form>
      </div>

      {/* Rooms Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sá»‘ phÃ²ng</th>
              <th>Loáº¡i phÃ²ng</th>
              <th>Sá»©c chá»©a</th>
              <th>GiÃ¡ / ngÃ y</th>
              <th>Tráº¡ng thÃ¡i</th>
              <th>MÃ´ táº£ chi tiáº¿t</th>
              <th style={{ textAlign: 'center' }}>HÃ nh Ä‘á»™ng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Äang táº£i danh sÃ¡ch phÃ²ng...</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>KhÃ´ng tÃ¬m tháº¥y phÃ²ng nÃ o.</td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.roomId}>
                  <td style={{ fontWeight: 700 }}>#{r.roomId}</td>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{r.roomNumber}</td>
                  <td>
                    <span className="badge badge-primary">{r.roomTypeName}</span>
                  </td>
                  <td>{r.roomMaxCapacity} ngÆ°á»i</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>
                    {formatPrice(r.roomPricePerDay)}
                  </td>
                  <td>
                    {r.roomStatus === 1 ? (
                      <span className="badge badge-success">Hoáº¡t Ä‘á»™ng (1)</span>
                    ) : (
                      <span className="badge badge-danger">NgÆ°ng HÄ (0)</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.roomDetailDescription || 'â€”'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn btn-secondary btn-sm"
                        title="Chá»‰nh sá»­a"
                      >
                        <Edit2 size={14} /> Sá»­a
                      </button>
                      <button
                        onClick={() => confirmDelete(r)}
                        className="btn btn-danger btn-sm"
                        title="XÃ³a phÃ²ng (Kiá»ƒm tra nghiá»‡p vá»¥)"
                      >
                        <Trash2 size={14} /> XÃ³a
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
        title={editingRoom ? `Chá»‰nh sá»­a phÃ²ng [${editingRoom.roomNumber}]` : 'ThÃªm phÃ²ng má»›i'}
      >
        <form onSubmit={handleSaveRoom}>
          <div className="form-group">
            <label className="form-label">Sá»‘ phÃ²ng (Room Number) *</label>
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
              <label className="form-label">Loáº¡i phÃ²ng (Room Type) *</label>
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
              <label className="form-label">Sá»©c chá»©a tá»‘i Ä‘a (NgÆ°á»i)</label>
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
              <label className="form-label">GiÃ¡ thuÃª má»—i ngÃ y (VNÄ) *</label>
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
              <label className="form-label">Tráº¡ng thÃ¡i phÃ²ng</label>
              <select
                className="form-select"
                value={formData.roomStatus}
                onChange={(e) => setFormData({ ...formData, roomStatus: Number(e.target.value) })}
              >
                <option value={1}>1 - Hoáº¡t Ä‘á»™ng (Active)</option>
                <option value={0}>0 - NgÆ°ng hoáº¡t Ä‘á»™ng (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">MÃ´ táº£ chi tiáº¿t phÃ²ng</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Tiá»‡n nghi phÃ²ng, hÆ°á»›ng nhÃ¬n, ban cÃ´ng..."
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
              Há»§y
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {editingRoom ? 'LÆ°u thay Ä‘á»•i' : 'Táº¡o phÃ²ng'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={executeDelete}
        title={`XÃ¡c nháº­n xÃ³a phÃ²ng [${roomToDelete?.roomNumber}]`}
        message={`Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a phÃ²ng ${roomToDelete?.roomNumber}? Há»‡ thá»‘ng sáº½ tá»± Ä‘á»™ng kiá»ƒm tra lá»‹ch sá»­ Ä‘áº·t phÃ²ng: náº¿u Ä‘Ã£ cÃ³ giao dá»‹ch thÃ¬ chuyá»ƒn tráº¡ng thÃ¡i sang ngÆ°ng hoáº¡t Ä‘á»™ng (Soft Delete), náº¿u chÆ°a tá»«ng cÃ³ giao dá»‹ch thÃ¬ xÃ³a vÄ©nh viá»…n (Hard Delete).`}
        confirmText="XÃ³a phÃ²ng"
        isDanger={true}
        loading={deleteLoading}
      />
    </div>
  );
};

export default StaffRoomManagement;

