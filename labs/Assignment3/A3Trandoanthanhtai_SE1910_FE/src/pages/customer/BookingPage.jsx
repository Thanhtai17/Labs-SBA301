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
import { bookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle2, BedDouble, AlertCircle, ShoppingCart } from 'lucide-react';

const BookingPage = ({ setActiveTab, preSelectedRoom }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  // Date range defaults: tomorrow to day after tomorrow
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTomorrow());
  const [endDate, setEndDate] = useState(getDayAfterTomorrow());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomApi.getAvailableRooms();
        setRooms(res.data);
        if (preSelectedRoom && res.data.some(r => r.roomId === preSelectedRoom.roomId)) {
          setSelectedRoomIds([preSelectedRoom.roomId]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [preSelectedRoom]);

  const toggleRoomSelection = (roomId) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();

  const selectedRooms = rooms.filter((r) => selectedRoomIds.includes(r.roomId));

  const totalPrice = selectedRooms.reduce((sum, r) => {
    return sum + (Number(r.roomPricePerDay) || 0) * nights;
  }, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedRoomIds.length === 0) {
      setError('Vui lÃ²ng chá»n Ã­t nháº¥t 1 phÃ²ng Ä‘á»ƒ Ä‘áº·t!');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('NgÃ y tráº£ phÃ²ng (End Date) pháº£i sau ngÃ y nháº­n phÃ²ng (Start Date)!');
      return;
    }

    setSubmitting(true);
    try {
      const roomDetails = selectedRooms.map((r) => ({
        roomId: r.roomId,
        startDate: startDate,
        endDate: endDate,
        actualPrice: (Number(r.roomPricePerDay) || 0) * nights
      }));

      await bookingApi.createBooking({
        roomDetails: roomDetails
      });

      setSuccess('Äáº·t phÃ²ng thÃ nh cÃ´ng! Äang chuyá»ƒn Ä‘áº¿n Lá»‹ch sá»­ Ä‘áº·t phÃ²ng...');
      setTimeout(() => {
        setActiveTab('customer-history');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi táº¡o Ä‘Æ¡n Ä‘áº·t phÃ²ng.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Äáº·t phÃ²ng trá»±c tuyáº¿n (Online Booking)
        </h1>
        <p style={{ color: '#64748b' }}>
          Chá»n má»™t hoáº·c nhiá»u phÃ²ng, khoáº£ng thá»i gian lÆ°u trÃº vÃ  xÃ¡c nháº­n Ä‘áº·t phÃ²ng
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '0.85rem 1rem',
          borderRadius: 8,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '0.85rem 1rem',
          borderRadius: 8,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Room Selection List */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#2563eb" />
              Chá»n ngÃ y lÆ°u trÃº
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">NgÃ y nháº­n phÃ²ng (Check-in)</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">NgÃ y tráº£ phÃ²ng (Check-out)</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
              Tá»•ng thá»i gian lÆ°u trÃº: <strong>{nights} Ä‘Ãªm</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Chá»n phÃ²ng ({selectedRoomIds.length} phÃ²ng Ä‘Ã£ chá»n)
          </h3>

          {loading ? (
            <p>Äang táº£i danh sÃ¡ch phÃ²ng...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rooms.map((room) => {
                const isSelected = selectedRoomIds.includes(room.roomId);
                return (
                  <div
                    key={room.roomId}
                    onClick={() => toggleRoomSelection(room.roomId)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 12,
                      padding: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#2563eb' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            PhÃ²ng {room.roomNumber}
                          </span>
                          <span className="badge badge-primary">{room.roomTypeName}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                          {room.roomDetailDescription} â€¢ Sá»©c chá»©a: {room.roomMaxCapacity} ngÆ°á»i
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>
                        {formatPrice(room.roomPricePerDay)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/ Ä‘Ãªm</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Booking Summary Card */}
        <div className="card" style={{ position: 'sticky', top: '5.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={20} color="#2563eb" />
            Chi tiáº¿t Ä‘Æ¡n Ä‘áº·t phÃ²ng
          </h3>

          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>KhÃ¡ch hÃ ng</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.email}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
              CÃ¡c phÃ²ng Ä‘Ã£ chá»n ({selectedRooms.length}):
            </div>
            {selectedRooms.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                ChÆ°a chá»n phÃ²ng nÃ o. HÃ£y tÃ­ch chá»n phÃ²ng bÃªn trÃ¡i.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedRooms.map((r) => (
                  <div key={r.roomId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>PhÃ²ng {r.roomNumber} ({nights} Ä‘Ãªm)</span>
                    <span style={{ fontWeight: 600 }}>{formatPrice(r.roomPricePerDay * nights)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            borderTop: '2px dashed #e2e8f0',
            paddingTop: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Tá»•ng cá»™ng:</span>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#2563eb' }}>
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleBookingSubmit}
            disabled={submitting || selectedRoomIds.length === 0}
            className="btn btn-primary"
            style={{ width: '100%', height: 46 }}
          >
            {submitting ? 'Äang xá»­ lÃ½...' : 'XÃ¡c nháº­n Äáº·t phÃ²ng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

