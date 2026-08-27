"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, token, isAuthenticated, loginAsUser, loginAsTeam, loginAsAdmin, logout, setUser } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role || null,
    loginAsUser,
    loginAsTeam,
    loginAsAdmin,
    logout,
    setUser,
  };
}
