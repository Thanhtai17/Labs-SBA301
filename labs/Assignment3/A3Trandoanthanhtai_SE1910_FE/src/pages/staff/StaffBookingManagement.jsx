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
        text: `Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n #${id} thÃ nh cÃ´ng!`
      });
      fetchBookings();
      if (selectedBooking && selectedBooking.bookingReservationId === id) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'CÃ³ lá»—i xáº£y ra khi cáº­p nháº­t tráº¡ng thÃ¡i.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge badge-success">1 - ÄÃ£ xÃ¡c nháº­n</span>;
      case 2:
        return <span className="badge badge-primary">2 - ÄÃ£ hoÃ n thÃ nh</span>;
      case 0:
        return <span className="badge badge-danger">0 - ÄÃ£ há»§y</span>;
      default:
        return <span className="badge badge-neutral">Chá» duyá»‡t</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
          Quáº£n lÃ½ Ä‘Æ¡n Ä‘áº·t phÃ²ng (Staff - Booking Management)
        </h1>
        <p style={{ color: '#64748b' }}>
          Quáº£n lÃ½ toÃ n bá»™ giao dá»‹ch Ä‘áº·t phÃ²ng, xem chi tiáº¿t phÃ²ng thuÃª vÃ  cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n
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
          <button onClick={() => setAlertMsg(null)} className="btn btn-secondary btn-sm">ÄÃ³ng</button>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>MÃ£ Ä‘Æ¡n</th>
              <th>NgÃ y táº¡o Ä‘Æ¡n</th>
              <th>KhÃ¡ch hÃ ng</th>
              <th>Email liÃªn há»‡</th>
              <th>Sá»‘ lÆ°á»£ng phÃ²ng</th>
              <th>Tá»•ng tiá»n</th>
              <th>Tráº¡ng thÃ¡i</th>
              <th style={{ textAlign: 'center' }}>HÃ nh Ä‘á»™ng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Äang táº£i danh sÃ¡ch Ä‘áº·t phÃ²ng...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>ChÆ°a cÃ³ giao dá»‹ch Ä‘áº·t phÃ²ng nÃ o.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingReservationId}>
                  <td style={{ fontWeight: 700 }}>#{b.bookingReservationId}</td>
                  <td>{b.bookingDate}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{b.customerFullName}</td>
                  <td>{b.customerEmail}</td>
                  <td>
                    <span className="badge badge-primary">{b.details?.length || 0} phÃ²ng</span>
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
                        title="Xem chi tiáº¿t"
                      >
                        <Eye size={14} /> Chi tiáº¿t
                      </button>

                      {b.bookingStatus !== 2 && (
                        <button
                          onClick={() => handleUpdateStatus(b.bookingReservationId, 2)}
                          className="btn btn-success btn-sm"
                          title="ÄÃ¡nh dáº¥u hoÃ n thÃ nh"
                        >
                          HoÃ n táº¥t
                        </button>
                      )}

                      {b.bookingStatus !== 0 && (
                        <button
                          onClick={() => handleUpdateStatus(b.bookingReservationId, 0)}
                          className="btn btn-danger btn-sm"
                          title="Há»§y Ä‘Æ¡n"
                        >
                          Há»§y Ä‘Æ¡n
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
        title={`Chi tiáº¿t Ä‘Æ¡n Ä‘áº·t phÃ²ng #${selectedBooking?.bookingReservationId}`}
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
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>KhÃ¡ch hÃ ng:</span>
                <div style={{ fontWeight: 700 }}>{selectedBooking.customerFullName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Email:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.customerEmail}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>NgÃ y Ä‘áº·t phÃ²ng:</span>
                <div style={{ fontWeight: 600 }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tráº¡ng thÃ¡i hiá»‡n táº¡i:</span>
                <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Chi tiáº¿t cÃ¡c phÃ²ng Ä‘Æ°á»£c thuÃª trong Ä‘Æ¡n nÃ y:
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
                      PhÃ²ng {d.roomNumber} - {d.roomTypeName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Tá»« ngÃ y: <strong>{d.startDate}</strong> Ä‘áº¿n <strong>{d.endDate}</strong>
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
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tá»•ng cá»™ng thanh toÃ¡n:</span>
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

