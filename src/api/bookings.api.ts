import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Booking,
  BookingRequest,
  BookingStatus,
} from "./types";

export const bookingsApi = {
  getAll: async (status?: BookingStatus): Promise<Booking[]> => {
    const params = status ? { status } : {};
    const res = await apiClient.get<ApiResponse<Booking[]>>("/bookings", {
      params,
    });
    return res.data.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data.data;
  },

  create: async (data: BookingRequest): Promise<Booking> => {
    const res = await apiClient.post<ApiResponse<Booking>>("/bookings", data);
    return res.data.data;
  },

  updateStatus: async (id: number, status: BookingStatus): Promise<Booking> => {
    const res = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${id}/status`,
      { status },
    );
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
};
