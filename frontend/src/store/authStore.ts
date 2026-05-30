import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  role: string | null;
  userId: string | null;
  isActive: boolean | null;
  setAuth: (
    accessToken: string,
    role: string,
    userId: string,
    isActive: boolean,
  ) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  userId: null,
  isActive: null,
  setAuth: (accessToken, role, userId, isActive) =>
    set({
      accessToken,
      role,
      userId,
      isActive,
    }),
  clearAuth: () =>
    set({
      accessToken: null,
      role: null,
      userId: null,
      isActive: null,
    }),
}));
