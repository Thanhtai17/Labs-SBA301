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

