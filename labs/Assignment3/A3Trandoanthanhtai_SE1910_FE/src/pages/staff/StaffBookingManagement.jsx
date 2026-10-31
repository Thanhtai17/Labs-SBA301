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
import { CalendarCheck, Eye, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const StaffBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await bookingApi.updateBookingStatus(id, newStatus);
      setAlertMsg({
        type: 'success',
        text: `Cập nhật trạng thái đơn #${id} thành công!`
      });
      fetchBookings();
      if (selectedBooking && selectedBooking.bookingReservationId === id) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge badge-success">1 - Đã xác nhận</span>;
      case 2:
        return <span className="badge badge-primary">2 - Đã hoàn thành</span>;
      case 0:
        return <span className="badge badge-danger">0 - Đã hủy</span>;
      default:
        return <span className="badge badge-neutral">Chờ duyệt</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Quản lý đơn đặt phòng (Staff - Booking Management)
        </h1>
        <p style={{ color: '#64748b' }}>
          Quản lý toàn bộ giao dịch đặt phòng, xem chi tiết phòng thuê và cập nhật trạng thái đơn
        </p>
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

      {/* Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày tạo đơn</th>
              <th>Khách hàng</th>
              <th>Email liên hệ</th>
              <th>Số lượng phòng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Đang tải danh sách đặt phòng...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Chưa có giao dịch đặt phòng nào.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingReservationId}>
                  <td style={{ fontWeight: 700 }}>#{b.bookingReservationId}</td>
                  <td>{b.bookingDate}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{b.customerFullName}</td>
                  <td>{b.customerEmail}</td>
                  <td>
                    <span className="badge badge-primary">{b.details?.length || 0} phòng</span>
                  </td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>
                    {formatPrice(b.totalPrice)}
                  </td>
                  <td>{getStatusBadge(b.bookingStatus)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="btn btn-secondary btn-sm"
                        title="Xem chi tiết"
                      >
                        <Eye size={14} /> Chi tiết
                      </button>

                      {b.bookingStatus !== 2 && (
                        <button
                          onClick={() => handleUpdateStatus(b.bookingReservationId, 2)}
                          className="btn btn-success btn-sm"
                          title="Đánh dấu hoàn thành"
                        >
                          Hoàn tất
                        </button>
                      )}

                      {b.bookingStatus !== 0 && (
                        <button
                          onClick={() => handleUpdateStatus(b.bookingReservationId, 0)}
                          className="btn btn-danger btn-sm"
                          title="Hủy đơn"
                        >
                          Hủy đơn
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

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Chi tiết đơn đặt phòng #${selectedBooking?.bookingReservationId}`}
        maxWidth={680}
      >
        {selectedBooking && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: 8
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Khách hàng:</span>
                <div style={{ fontWeight: 700 }}>{selectedBooking.customerFullName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Email:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.customerEmail}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ngày đặt phòng:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Trạng thái hiện tại:</span>
                <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Chi tiết các phòng được thuê trong đơn này:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedBooking.details?.map((d, index) => (
                <div key={index} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
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

            <div style={{
              borderTop: '2px dashed #e2e8f0',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng thanh toán:</span>
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

export default StaffBookingManagement;

