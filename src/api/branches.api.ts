import { delay, MOCK_BRANCHES } from "./mockData";
import type { Branch, BranchRequest } from "./types";

export const branchesApi = {
  getAll: async (): Promise<Branch[]> => {
    await delay(500);
    return [...MOCK_BRANCHES];
  },

  getById: async (id: number): Promise<Branch> => {
    await delay(300);
    const branch = MOCK_BRANCHES.find((b) => b.id === id);
    if (!branch) throw new Error("Branch not found");
    return { ...branch };
  },

  create: async (data: BranchRequest): Promise<Branch> => {
    await delay(600);
    const newBranch: Branch = {
      id: Date.now(),
      name: data.name,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      hours: data.hours,
      mapsUrl: data.mapsUrl,
      imageUrl: data.imageUrl,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_BRANCHES.push(newBranch);
    return { ...newBranch };
  },

  update: async (id: number, data: BranchRequest): Promise<Branch> => {
    await delay(500);
    const index = MOCK_BRANCHES.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Branch not found");
    MOCK_BRANCHES[index] = { ...MOCK_BRANCHES[index], ...data, updatedAt: new Date().toISOString() };
    return { ...MOCK_BRANCHES[index] };
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = MOCK_BRANCHES.findIndex((b) => b.id === id);
    if (index !== -1) {
      MOCK_BRANCHES.splice(index, 1);
    }
  },
};
