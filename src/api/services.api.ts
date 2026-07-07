import { delay, MOCK_SERVICES } from "./mockData";
import type { SalonService, ServiceRequest } from "./types";

export const servicesApi = {
  getAll: async (category?: string): Promise<SalonService[]> => {
    await delay(500);
    if (category) {
      return MOCK_SERVICES.filter((s) => s.category === category);
    }
    return [...MOCK_SERVICES];
  },

  getById: async (id: number): Promise<SalonService> => {
    await delay(300);
    const service = MOCK_SERVICES.find((s) => s.id === id);
    if (!service) throw new Error("Service not found");
    return { ...service };
  },

  create: async (data: ServiceRequest): Promise<SalonService> => {
    await delay(600);
    const newService: SalonService = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      price: data.price,
      duration: data.duration,
      description: data.description,
      imageUrl: data.imageUrl,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SERVICES.push(newService);
    return { ...newService };
  },

  update: async (id: number, data: ServiceRequest): Promise<SalonService> => {
    await delay(500);
    const index = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Service not found");
    MOCK_SERVICES[index] = { ...MOCK_SERVICES[index], ...data, updatedAt: new Date().toISOString() };
    return { ...MOCK_SERVICES[index] };
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (index !== -1) {
      MOCK_SERVICES.splice(index, 1);
    }
  },
};
