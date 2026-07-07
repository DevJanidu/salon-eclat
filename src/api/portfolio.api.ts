import { delay, MOCK_PORTFOLIO } from "./mockData";
import type { PortfolioItem, PortfolioRequest } from "./types";

export const portfolioApi = {
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
  }): Promise<PortfolioItem[]> => {
    await delay(500);
    let items = [...MOCK_PORTFOLIO];
    if (params?.category) {
      items = items.filter((item) => item.category === params.category);
    }
    if (params?.featured !== undefined) {
      items = items.filter((item) => item.featured === params.featured);
    }
    return items;
  },

  getById: async (id: number): Promise<PortfolioItem> => {
    await delay(300);
    const item = MOCK_PORTFOLIO.find((p) => p.id === id);
    if (!item) throw new Error("Portfolio item not found");
    return { ...item };
  },

  create: async (data: PortfolioRequest): Promise<PortfolioItem> => {
    await delay(600);
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl,
      featured: data.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_PORTFOLIO.push(newItem);
    return { ...newItem };
  },

  update: async (
    id: number,
    data: PortfolioRequest,
  ): Promise<PortfolioItem> => {
    await delay(500);
    const index = MOCK_PORTFOLIO.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Portfolio item not found");
    MOCK_PORTFOLIO[index] = { ...MOCK_PORTFOLIO[index], ...data, updatedAt: new Date().toISOString() };
    return { ...MOCK_PORTFOLIO[index] };
  },

  delete: async (id: number): Promise<void> => {
    await delay(500);
    const index = MOCK_PORTFOLIO.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PORTFOLIO.splice(index, 1);
    }
  },
};
