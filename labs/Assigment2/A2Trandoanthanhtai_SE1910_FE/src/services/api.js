/**
 * Project: FUNewsManagementSystem - Assignment 02 (Frontend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.fieldErrors) {
        message = Object.values(error.response.data.fieldErrors).join(', ');
      }
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  }
};

export const accountService = {
  getAll: async (keyword) => {
    const res = await api.get('/accounts', { params: { keyword } });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/accounts/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/accounts', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/accounts/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/accounts/${id}`);
  }
};

export const categoryService = {
  getAll: async (keyword, activeOnly) => {
    const res = await api.get('/categories', { params: { keyword, activeOnly } });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/categories/${id}`);
  }
};

export const newsService = {
  getAll: async (params = {}) => {
    const res = await api.get('/news', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/news/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/news', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/news/${id}`);
  }
};

export const tagService = {
  getAll: async () => {
    const res = await api.get('/tags');
    return res.data;
  }
};

export const profileService = {
  getById: async (id) => {
    const res = await api.get(`/profile/${id}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/profile/${id}`, data);
    return res.data;
  }
};

export default api;

