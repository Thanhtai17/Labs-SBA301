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
import { roomApi } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, BedDouble, Users, CheckCircle, Tag, Sparkles } from 'lucide-react';

const HomePage = ({ setActiveTab, setSelectedBookingRoom }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAllRooms({
          keyword: keyword || undefined,
          roomTypeId: selectedType || undefined,
          status: 1 // only show active rooms for public
        }),
        roomApi.getRoomTypes()
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleBookNow = (room) => {
    if (setSelectedBookingRoom) {
      setSelectedBookingRoom(room);
    }
    if (!isAuthenticated) {
      setActiveTab('login');
    } else if (isCustomer) {
      setActiveTab('customer-booking');
    } else {
      setActiveTab('staff-bookings');
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: 'white',
        borderRadius: 16,
        padding: '3rem 2rem',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 700, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.8rem',
            borderRadius: 9999,
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} color="#fef08a" />
            Trải nghiệm nghỉ dưỡng tuyệt vời tại FU Mini Hotel
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Khám phá phòng nghỉ & Dịch vụ chuẩn mực
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Hệ thống hiển thị phòng thời gian thực, không cần đăng nhập vẫn có thể tra cứu thông tin giá, loại phòng và tiện nghi đầy đủ.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Tìm theo số phòng, mô tả phòng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ flex: '0 1 220px' }}>
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Tất cả loại phòng</option>
              {roomTypes.map((type) => (
                <option key={type.roomTypeId} value={type.roomTypeId}>
                  {type.roomTypeName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: 42 }}>
            <Search size={16} />
            Tìm kiếm
          </button>

          {(keyword || selectedType) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setKeyword(''); setSelectedType(''); }}
              style={{ height: 42 }}
            >
              Đặt lại
            </button>
          )}
        </form>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          Đang tải danh sách phòng...
        </div>
      ) : rooms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BedDouble size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>Không tìm thấy phòng phù hợp</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Vui lòng thử tìm kiếm với từ khóa hoặc loại phòng khác.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                      {room.roomTypeName || 'Standard'}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Phòng {room.roomNumber}
                    </h3>
                  </div>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> Sẵn sàng
                  </span>
                </div>

                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  marginBottom: '1rem',
                  minHeight: '2.8rem'
                }}>
                  {room.roomDetailDescription || 'Phòng nghỉ tiện nghi đầy đủ máy lạnh, wifi, tivi màn hình phẳng.'}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#475569' }}>
                    <Users size={16} color="#64748b" />
                    <span>Sức chứa: <strong>{room.roomMaxCapacity || 2} người</strong></span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Giá mỗi đêm</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>
                    {formatPrice(room.roomPricePerDay)}
                  </div>
                </div>

                <button
                  onClick={() => handleBookNow(room)}
                  className="btn btn-primary btn-sm"
                >
                  Đặt phòng ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

