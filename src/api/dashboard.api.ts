import { delay, MOCK_DASHBOARD_STATS } from "./mockData";
import type { DashboardStats } from "./types";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return { ...MOCK_DASHBOARD_STATS };
  },
};
