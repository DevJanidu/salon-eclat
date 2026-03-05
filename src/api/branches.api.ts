import apiClient from "@/lib/apiClient";
import type { ApiResponse, Branch, BranchRequest } from "./types";

export const branchesApi = {
  getAll: async (): Promise<Branch[]> => {
    const res = await apiClient.get<ApiResponse<Branch[]>>("/branches");
    return res.data.data;
  },

  getById: async (id: number): Promise<Branch> => {
    const res = await apiClient.get<ApiResponse<Branch>>(`/branches/${id}`);
    return res.data.data;
  },

  create: async (data: BranchRequest): Promise<Branch> => {
    const res = await apiClient.post<ApiResponse<Branch>>("/branches", data);
    return res.data.data;
  },

  update: async (id: number, data: BranchRequest): Promise<Branch> => {
    const res = await apiClient.put<ApiResponse<Branch>>(
      `/branches/${id}`,
      data,
    );
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/branches/${id}`);
  },
};
