"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthCookie, removeAuthCookie } from "@/lib/cookieAuth";

type Role = "USER" | "TEAM" | "ADMIN";

interface AuthState {
  user: {
    id: string;
    role: Role;
    name?: string;
    email?: string;
    mobileNumber?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  // Actions
  loginAsUser: (user: AuthState["user"], token: string) => void;
  loginAsTeam: (user: AuthState["user"], token: string) => void;
  loginAsAdmin: (user: AuthState["user"], token: string) => void;
  logout: () => void;
  setUser: (user: AuthState["user"]) => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      loginAsUser: (user, token) => {
        setAuthCookie(token);
        set({ user, token, isAuthenticated: true });
      },

      loginAsTeam: (user, token) => {
        setAuthCookie(token);
        set({ user: user ? { ...user, role: "TEAM" as Role } : null, token, isAuthenticated: true });
      },

      loginAsAdmin: (user, token) => {
        setAuthCookie(token);
        set({ user: user ? { ...user, role: "ADMIN" as Role } : null, token, isAuthenticated: true });
      },

      logout: () => {
        removeAuthCookie();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "banksahayak-auth",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    }
  )
);
