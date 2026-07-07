import { delay } from "./mockData";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    await delay(500);
    return {
      token: "mock-jwt-token-12345",
      tokenType: "Bearer",
      email: data.email,
      role: data.email.includes("admin") ? "ADMIN" : "STAFF",
    };
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await delay(500);
  },
};
