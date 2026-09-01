"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Client-side guard for public pages like the landing page.
 * Redirects authenticated users to their dashboard.
 */
export default function LandingGuard({
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

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return <>{children}</>;
}
