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
import { CalendarCheck, Eye, CheckCircle, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
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
      setAlertMsg({ type: 'error', text: err.message || 'Không thể tải danh sách đặt phòng.' });
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
      const actionName =
        newStatus === 1 ? 'Duyệt và xác nhận' : newStatus === 2 ? 'Đánh dấu hoàn thành' : 'Hủy';
      setAlertMsg({
        type: 'success',
        text: `${actionName} đơn đặt phòng #${id} thành công!`
      });
      fetchBookings();
      if (selectedBooking && selectedBooking.bookingReservationId === id) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.message || 'Có lỗi xảy ra khi cập nhật trạng thái.' });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 3:
        return (
          <span
            className="badge badge-warning"
            style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700
            }}
          >
            <Clock size={12} /> 3 - Chờ duyệt
          </span>
        );
      case 1:
        return (
          <span
            className="badge badge-success"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700
            }}
          >
            <CheckCircle2 size={12} /> 1 - Đã xác nhận
          </span>
        );
      case 2:
        return (
          <span
            className="badge badge-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700
            }}
          >
            <CheckCircle size={12} /> 2 - Đã hoàn thành
          </span>
        );
      case 0:
        return (
          <span
            className="badge badge-danger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700
            }}
          >
            <XCircle size={12} /> 0 - Đã hủy
          </span>
        );
      default:
        return (
          <span
            className="badge badge-warning"
            style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700
            }}
          >
            <Clock size={12} /> 3 - Chờ duyệt
          </span>
        );
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
          background: alertMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${alertMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
          color: alertMsg.type === 'error' ? '#b91c1c' : '#15803d',
          padding: '0.85rem 1rem',
          borderRadius: 8,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            {alertMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
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
              <th style={{ textAlign: 'center', minWidth: '220px', whiteSpace: 'nowrap' }}>Hành động</th>
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
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'nowrap' }}>
                      {/* Nút Xem chi tiết: Luôn khả dụng để xem thông tin đơn */}
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          padding: '0.28rem 0.55rem',
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="Xem chi tiết đơn đặt phòng"
                      >
                        <Eye size={13} /> Chi tiết
                      </button>

                      {/* Khi ở trạng thái 3 (Chờ duyệt): Nút Duyệt đơn & Nút Hủy đơn */}
                      {b.bookingStatus === 3 && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b.bookingReservationId, 1)}
                            className="btn btn-success btn-sm"
                            style={{
                              padding: '0.28rem 0.55rem',
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Duyệt và xác nhận đơn đặt phòng"
                          >
                            <CheckCircle2 size={13} /> Duyệt đơn
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.bookingReservationId, 0)}
                            className="btn btn-danger btn-sm"
                            style={{
                              padding: '0.28rem 0.55rem',
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Hủy đơn đặt phòng"
                          >
                            <XCircle size={13} /> Hủy đơn
                          </button>
                        </>
                      )}

                      {/* Khi ở trạng thái 1 (Đã xác nhận): Nút Hoàn tất & Nút Hủy đơn */}
                      {b.bookingStatus === 1 && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b.bookingReservationId, 2)}
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: '0.28rem 0.55rem',
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Đánh dấu đã hoàn thành nhận phòng"
                          >
                            <CheckCircle size={13} /> Hoàn tất
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.bookingReservationId, 0)}
                            className="btn btn-danger btn-sm"
                            style={{
                              padding: '0.28rem 0.55rem',
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Hủy đơn đặt phòng"
                          >
                            <XCircle size={13} /> Hủy đơn
                          </button>
                        </>
                      )}

                      {/* Khi ở trạng thái 2 (Đã hoàn thành): Nút Hủy đơn bóng mờ vô hiệu hóa, chỉ có thể xem chi tiết */}
                      {b.bookingStatus === 2 && (
                        <button
                          disabled
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.28rem 0.55rem',
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            opacity: 0.45,
                            cursor: 'not-allowed',
                            background: '#f1f5f9',
                            color: '#94a3b8',
                            border: '1px solid #e2e8f0'
                          }}
                          title="Đơn đã hoàn tất, không thể hủy đơn"
                        >
                          <XCircle size={13} /> Hủy đơn
                        </button>
                      )}

                      {/* Khi ở trạng thái 0 (Đã hủy): Nút Hủy đơn hiển thị vô hiệu hóa */}
                      {b.bookingStatus === 0 && (
                        <button
                          disabled
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.28rem 0.55rem',
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            opacity: 0.45,
                            cursor: 'not-allowed',
                            background: '#fef2f2',
                            color: '#f87171',
                            border: '1px solid #fee2e2'
                          }}
                          title="Đơn này đã bị hủy"
                        >
                          <XCircle size={13} /> Đã hủy
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

