"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: ("USER" | "TEAM" | "ADMIN")[];
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/select-language");
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      // Redirect to appropriate dashboard
      if (role === "ADMIN") router.push("/admin");
      else if (role === "TEAM") router.push("/team");
      else router.push("/dashboard");
    }
  }, [isAuthenticated, role, allowedRoles, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting...</p>
      </div>
    );
  }

  if (role && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Access denied. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
