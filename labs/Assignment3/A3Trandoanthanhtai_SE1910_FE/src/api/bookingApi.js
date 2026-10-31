/**
 * Project: FUMiniHotelSystem - Assignment 03 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
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

