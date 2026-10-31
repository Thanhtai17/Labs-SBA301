import axiosClient from './axiosClient';

export const bookingApi = {
  // Customer & Staff
  createBooking: (data) => axiosClient.post('/bookings', data),
  getBookingById: (id) => axiosClient.get(`/bookings/${id}`),

  // Customer History
  getMyBookingHistory: () => axiosClient.get('/bookings/my-history'),

  // Staff Management
  getAllBookings: () => axiosClient.get('/bookings'),
  updateBookingStatus: (id, bookingStatus) =>
    axiosClient.patch(`/bookings/${id}/status`, { bookingStatus }),
};

