import { api } from './api';

export const authService = {
  login: async (credentials) => {
    // For now, if backend isn't ready we mock the response, but route it through API for later
    try {
      // const response = await api.post('/auth/login', credentials);
      // return response.data;
      
      // MOCK BACKEND RESPONSE
      console.log('Mocking backend auth for:', credentials.username);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            accessToken: 'mock_jwt_token',
            refreshToken: 'mock_refresh_token',
            user: {
              id: 'USR-101',
              name: 'DCP Vikram Rathore, IPS',
              role: credentials.role || 'Investigator',
              badge: 'IPS-KA-2016-89',
              district: 'State HQ Bengaluru',
              permissions: ['view_cases', 'edit_cases', 'run_ai']
            }
          });
        }, 1000);
      });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      // await api.post('/auth/logout');
      localStorage.removeItem('ksp_access_token');
      localStorage.removeItem('ksp_refresh_token');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentUser: async () => {
    try {
      // return await api.get('/auth/me');
      
      // MOCK
      return new Promise((resolve) => {
        resolve({
          data: {
            id: 'USR-101',
            name: 'DCP Vikram Rathore, IPS',
            role: 'Investigator',
            badge: 'IPS-KA-2016-89',
            district: 'State HQ Bengaluru'
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }
};
