import * as dashboardService from '../services/dashboard.service.js';

export const getStats = async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.json({ success: true, data: stats });
};
