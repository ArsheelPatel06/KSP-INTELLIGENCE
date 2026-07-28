import { api } from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', { ...credentials, deliveryMode: 'body' });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (data) => {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCatalystToken: async () => {
    try {
      const response = await api.post('/auth/catalyst-token');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('ksp_access_token');
      localStorage.removeItem('ksp_refresh_token');
      window.location.href = '/login';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};
