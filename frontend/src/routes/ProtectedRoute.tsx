"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "TEAM" | "ADMIN";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasHydrated, role } = useAuth();
  const router = useRouter();

  // Wait for Zustand hydration before checking auth
  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      if (role === "ADMIN") router.push("/admin");
      else if (role === "TEAM") router.push("/team");
      else router.push("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, role, requiredRole, router]);

  // Show loading while hydration is in progress
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting...</p>
      </div>
    );
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Access denied. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
