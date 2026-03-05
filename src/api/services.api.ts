import apiClient from "@/lib/apiClient";
import type { ApiResponse, SalonService, ServiceRequest } from "./types";

export const servicesApi = {
  getAll: async (category?: string): Promise<SalonService[]> => {
    const params = category ? { category } : {};
    const res = await apiClient.get<ApiResponse<SalonService[]>>("/services", {
      params,
    });
    return res.data.data;
  },

  getById: async (id: number): Promise<SalonService> => {
    const res = await apiClient.get<ApiResponse<SalonService>>(
      `/services/${id}`,
    );
    return res.data.data;
  },

  create: async (data: ServiceRequest): Promise<SalonService> => {
    const res = await apiClient.post<ApiResponse<SalonService>>(
      "/services",
      data,
    );
    return res.data.data;
  },

  update: async (id: number, data: ServiceRequest): Promise<SalonService> => {
    const res = await apiClient.put<ApiResponse<SalonService>>(
      `/services/${id}`,
      data,
    );
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
};
