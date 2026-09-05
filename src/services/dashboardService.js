import { api } from './api.js';

export const dashboardService = {
  /**
   * Fetch aggregated dashboard statistics
   */
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  /**
   * Seed demo data
   */
  seedData: async () => {
    const res = await api.post('/seed');
    return res;
  },

  /**
   * Check backend health
   */
  checkHealth: async () => {
    const res = await api.get('/health');
    return res;
  },
};
