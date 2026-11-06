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
import { bookingApi } from '../../api/bookingApi';
import { History, Calendar, BedDouble, AlertCircle, Eye } from 'lucide-react';
import Modal from '../../components/Modal';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getMyBookingHistory();
      setBookings(res.data);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge badge-success">Đã xác nhận</span>;
      case 2:
        return <span className="badge badge-primary">Đã hoàn thành</span>;
      case 0:
        return <span className="badge badge-danger">Đã hủy</span>;
      default:
        return <span className="badge badge-neutral">Chờ duyệt</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Lịch sử đặt phòng (Booking History)
        </h1>
        <p style={{ color: '#64748b' }}>
          Theo dõi danh sách các đơn đặt phòng và chi tiết phòng đã đặt
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Đang tải dữ liệu lịch sử đặt phòng...
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <History size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>Bạn chưa có đơn đặt phòng nào</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Hãy vào mục "Đặt phòng trực tuyến" để bắt đầu trải nghiệm dịch vụ của khách sạn!
          </p>
        </div>
      ) : (
        <div className="table-responsive card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Số lượng phòng</th>
                <th>Danh sách phòng</th>
                <th>Tổng thanh toán</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingReservationId}>
                  <td style={{ fontWeight: 700 }}>#{b.bookingReservationId}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.details?.length || 0} phòng</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {b.details?.map((d, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {d.roomNumber} ({d.roomTypeName})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>
                    {formatPrice(b.totalPrice)}
                  </td>
                  <td>{getStatusBadge(b.bookingStatus)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Chi tiết đơn đặt phòng #${selectedBooking?.bookingReservationId}`}
        maxWidth={650}
      >
        {selectedBooking && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ngày đặt:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Trạng thái:</span>
                <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Khách hàng:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.customerFullName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Email:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.customerEmail}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Danh sách phòng đặt:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedBooking.details?.map((d, index) => (
                <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      Phòng {d.roomNumber} - {d.roomTypeName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Từ ngày: <strong>{d.startDate}</strong> đến <strong>{d.endDate}</strong>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>
                    {formatPrice(d.actualPrice)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng thanh toán:</span>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#2563eb' }}>
                {formatPrice(selectedBooking.totalPrice)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingHistoryPage;

