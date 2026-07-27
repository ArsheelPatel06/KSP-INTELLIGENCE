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

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('ksp_access_token');
      localStorage.removeItem('ksp_refresh_token');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
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
