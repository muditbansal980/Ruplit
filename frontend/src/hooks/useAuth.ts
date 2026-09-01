"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, token, isAuthenticated, _hasHydrated, loginAsUser, loginAsTeam, loginAsAdmin, logout, setUser } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    hasHydrated: _hasHydrated,
    role: user?.role || null,
    loginAsUser,
    loginAsTeam,
    loginAsAdmin,
    logout,
    setUser,
  };
}
