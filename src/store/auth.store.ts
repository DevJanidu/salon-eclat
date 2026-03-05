import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  email: string;
  role: "ADMIN" | "STAFF";
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: () => boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => !!get().token && !!get().user,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "salon-auth-storage",
    },
  ),
);
