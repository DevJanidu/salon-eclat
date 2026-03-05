import apiClient from "@/lib/apiClient";
import type { ApiResponse, StaffMember, StaffRequest } from "./types";

export const staffApi = {
  getAll: async (branchId?: number): Promise<StaffMember[]> => {
    const params = branchId ? { branchId } : {};
    const res = await apiClient.get<ApiResponse<StaffMember[]>>("/staff", {
      params,
    });
    return res.data.data;
  },

  getById: async (id: number): Promise<StaffMember> => {
    const res = await apiClient.get<ApiResponse<StaffMember>>(`/staff/${id}`);
    return res.data.data;
  },

  create: async (data: StaffRequest): Promise<StaffMember> => {
    const res = await apiClient.post<ApiResponse<StaffMember>>("/staff", data);
    return res.data.data;
  },

  update: async (id: number, data: StaffRequest): Promise<StaffMember> => {
    const res = await apiClient.put<ApiResponse<StaffMember>>(
      `/staff/${id}`,
      data,
    );
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },
};
