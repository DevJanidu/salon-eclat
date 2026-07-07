import { delay, MOCK_BOOKINGS } from "./mockData";
import type { Booking, BookingRequest, BookingStatus } from "./types";

export const bookingsApi = {
  getAll: async (status?: BookingStatus): Promise<Booking[]> => {
    await delay(500);
    if (status) {
      return MOCK_BOOKINGS.filter((b) => b.status === status);
    }
    return [...MOCK_BOOKINGS];
  },

  getById: async (id: number): Promise<Booking> => {
    await delay(300);
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found");
    return { ...booking };
  },

  create: async (data: BookingRequest): Promise<Booking> => {
    await delay(600);
    const newBooking: Booking = {
      id: Date.now(),
      branchId: data.branchId,
      branchName: `Mock Branch ${data.branchId}`,
      services: data.services,
      date: data.date,
      time: data.time,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_BOOKINGS.push(newBooking);
    return { ...newBooking };
  },

  updateStatus: async (id: number, status: BookingStatus): Promise<Booking> => {
    await delay(500);
    const index = MOCK_BOOKINGS.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    MOCK_BOOKINGS[index] = { ...MOCK_BOOKINGS[index], status, updatedAt: new Date().toISOString() };
    return { ...MOCK_BOOKINGS[index] };
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = MOCK_BOOKINGS.findIndex((b) => b.id === id);
    if (index !== -1) {
      MOCK_BOOKINGS.splice(index, 1);
    }
  },
};
