import axios from 'axios';

// Create the axios instance
export const api = axios.create({
  baseURL: '/api/v1', // Using Vite proxy or relative path if served together
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ksp_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Refresh Token / Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('ksp_refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // Request new access token
        const res = await axios.post('/api/v1/auth/refresh', { token: refreshToken });
        
        if (res.data?.accessToken) {
          localStorage.setItem('ksp_access_token', res.data.accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear session and redirect to login
        localStorage.removeItem('ksp_access_token');
        localStorage.removeItem('ksp_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
