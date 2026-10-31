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

export const customerApi = {
  // Customer Self Profile
  getMyProfile: () => axiosClient.get('/customer/profile'),
  updateMyProfile: (data) => axiosClient.put('/customer/profile', data),

  // Staff Management
  getAllCustomers: (params) => axiosClient.get('/customers', { params }),
  getCustomerById: (id) => axiosClient.get(`/customers/${id}`),
  createCustomer: (data) => axiosClient.post('/customers', data),
  updateCustomer: (id, data) => axiosClient.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosClient.delete(`/customers/${id}`),
};

