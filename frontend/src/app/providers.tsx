"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AgentPanel from "@/components/agent/AgentPanel";
import AgentRegistryDebug from "@/components/AgentRegistryDebug";
import { useState } from "react";
import { initI18n } from "@/lib/i18n";

interface ProvidersProps {
  children: React.ReactNode;
  /** Language code read from the cookie by the server layout.
   *  Passed as a prop so both server SSR and client hydration
   *  initialize i18next with the SAME language. */
  initialLanguage: string;
}

export function Providers({ children, initialLanguage }: ProvidersProps) {
  // Initialize i18next exactly once with the server-determined language.
  // This runs during both SSR and client hydration, producing identical output.
  initI18n(initialLanguage);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
      <AgentPanel />
      <AgentRegistryDebug />
    </QueryClientProvider>
  );
}
