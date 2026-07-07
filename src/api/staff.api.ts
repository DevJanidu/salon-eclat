import { delay, MOCK_STAFF } from "./mockData";
import type { StaffMember, StaffRequest } from "./types";

export const staffApi = {
  getAll: async (branchId?: number): Promise<StaffMember[]> => {
    await delay(500);
    if (branchId) {
      return MOCK_STAFF.filter((s) => s.branchId === branchId);
    }
    return [...MOCK_STAFF];
  },

  getById: async (id: number): Promise<StaffMember> => {
    await delay(300);
    const staff = MOCK_STAFF.find((s) => s.id === id);
    if (!staff) throw new Error("Staff member not found");
    return { ...staff };
  },

  create: async (data: StaffRequest): Promise<StaffMember> => {
    await delay(600);
    const newStaff: StaffMember = {
      id: Date.now(),
      name: data.name,
      role: data.role,
      branchId: data.branchId,
      branchName: `Mock Branch ${data.branchId}`,
      phone: data.phone,
      email: data.email,
      rating: data.rating,
      imageUrl: data.imageUrl,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_STAFF.push(newStaff);
    return { ...newStaff };
  },

  update: async (id: number, data: StaffRequest): Promise<StaffMember> => {
    await delay(500);
    const index = MOCK_STAFF.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Staff member not found");
    MOCK_STAFF[index] = { ...MOCK_STAFF[index], ...data, updatedAt: new Date().toISOString() };
    return { ...MOCK_STAFF[index] };
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = MOCK_STAFF.findIndex((s) => s.id === id);
    if (index !== -1) {
      MOCK_STAFF.splice(index, 1);
    }
  },
};
