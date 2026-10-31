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

export const roomApi = {
  // Public
  getAllRooms: (params) => axiosClient.get('/rooms', { params }),
  getAvailableRooms: () => axiosClient.get('/rooms/available'),
  getRoomById: (id) => axiosClient.get(`/rooms/${id}`),
  getRoomTypes: () => axiosClient.get('/room-types'),

  // Staff CRUD
  createRoom: (data) => axiosClient.post('/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  deleteRoom: (id) => axiosClient.delete(`/rooms/${id}`),
};

