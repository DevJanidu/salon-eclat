import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data,
    );
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<void>>("/auth/change-password", data);
  },
};
