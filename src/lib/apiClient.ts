import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
