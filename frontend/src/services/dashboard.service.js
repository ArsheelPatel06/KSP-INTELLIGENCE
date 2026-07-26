import { api } from './api';

export const dashboardService = {
  /**
   * Fetch the global dashboard overview data
   * @returns {Promise<Object>} The overview data object containing summary cards, cases, hotspots, etc.
   */
  getOverview: async () => {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data?.item || {};
    } catch (error) {
      console.error('Dashboard Service Error:', error);
      throw error;
    }
  },

  /**
   * Fetch the officer-specific dashboard data
   * @param {string|number} employeeId
   * @returns {Promise<Object>}
   */
  getOfficerDashboard: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/officers/${employeeId}`);
      return response.data?.item || {};
    } catch (error) {
      console.error('Officer Dashboard Service Error:', error);
      throw error;
    }
  }
};
