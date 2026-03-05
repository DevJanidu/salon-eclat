import apiClient from "@/lib/apiClient";
import type { ApiResponse, DashboardStats } from "./types";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res =
      await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    return res.data.data;
  },
};
