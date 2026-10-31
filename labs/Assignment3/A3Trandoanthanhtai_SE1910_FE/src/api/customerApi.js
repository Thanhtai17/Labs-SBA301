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

