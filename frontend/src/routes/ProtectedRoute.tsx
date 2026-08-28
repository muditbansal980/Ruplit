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
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/select-language");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (role === "ADMIN") router.push("/admin");
      else if (role === "TEAM") router.push("/team");
      else router.push("/dashboard");
    }
  }, [isAuthenticated, role, requiredRole, router]);

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
