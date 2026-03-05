import apiClient from "@/lib/apiClient";
import type { ApiResponse, PortfolioItem, PortfolioRequest } from "./types";

export const portfolioApi = {
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
  }): Promise<PortfolioItem[]> => {
    const res = await apiClient.get<ApiResponse<PortfolioItem[]>>(
      "/portfolio",
      { params },
    );
    return res.data.data;
  },

  getById: async (id: number): Promise<PortfolioItem> => {
    const res = await apiClient.get<ApiResponse<PortfolioItem>>(
      `/portfolio/${id}`,
    );
    return res.data.data;
  },

  create: async (data: PortfolioRequest): Promise<PortfolioItem> => {
    const res = await apiClient.post<ApiResponse<PortfolioItem>>(
      "/portfolio",
      data,
    );
    return res.data.data;
  },

  update: async (
    id: number,
    data: PortfolioRequest,
  ): Promise<PortfolioItem> => {
    const res = await apiClient.put<ApiResponse<PortfolioItem>>(
      `/portfolio/${id}`,
      data,
    );
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/portfolio/${id}`);
  },
};
