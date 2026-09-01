"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Wraps public pages (landing, signup, greeting).
 * If the user is already authenticated, redirect them straight to the dashboard.
 */
export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "ADMIN") router.replace("/admin");
      else if (role === "TEAM") router.replace("/team");
      else router.replace("/dashboard");
    }
  }, [isAuthenticated, role, router]);

  // While checking auth state, show nothing (avoids flash of landing page)
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
