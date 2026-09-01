"use client";

import { useEffect } from "react";
import type { PageManifest } from "@/types/agent";
import { useAgentRegistryStore } from "@/store/agentRegistryStore";

/**
 * Call this hook once in a page component to announce itself to the
 * agent registry. It registers the page on mount and removes it on
 * unmount.
 *
 * **Important:** pass a stable route string — the effect depends only
 * on `manifest.route` (value comparison), not on the manifest object
 * reference, to avoid an infinite register/unregister loop when the
 * caller passes an inline object literal.
 *
 * @example
 * ```tsx
 * useRegisterPage({
 *   route: "/dashboard",
 *   title: "Dashboard",
 *   description: "The main hub where a user sees all available banking features…",
 * });
 * ```
 */
export function useRegisterPage(manifest: PageManifest): void {
  const registerPage = useAgentRegistryStore((s) => s.registerPage);
  const unregisterPage = useAgentRegistryStore((s) => s.unregisterPage);

  useEffect(() => {
    registerPage(manifest);

    return () => {
      unregisterPage(manifest.route);
    };
    // We intentionally depend only on the route string (stable primitive)
    // so that an inline manifest object doesn't cause re-registration on
    // every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest.route, registerPage, unregisterPage]);
}
