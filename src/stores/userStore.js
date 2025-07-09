import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (partial) =>
        set((state) => ({ user: { ...state.user, ...partial } })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "fast-community-user", // localStorage key
      partialize: (state) => ({ user: state.user }),
    }
  )
);
