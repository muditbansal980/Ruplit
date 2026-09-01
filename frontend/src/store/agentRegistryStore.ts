"use client";

import { create } from "zustand";
import type { PageManifest } from "@/types/agent";

interface AgentRegistryState {
  /** Map of route → manifest for every currently-mounted page. */
  pages: Record<string, PageManifest>;

  /** Add or update a page entry (merges — never replaces the whole map). */
  registerPage: (manifest: PageManifest) => void;

  /** Remove a single page entry by route. */
  unregisterPage: (route: string) => void;
}

export const useAgentRegistryStore = create<AgentRegistryState>()((set) => ({
  pages: {},

  registerPage: (manifest) =>
    set((state) => ({
      pages: { ...state.pages, [manifest.route]: manifest },
    })),

  unregisterPage: (route) =>
    set((state) => {
      const { [route]: _, ...rest } = state.pages;
      return { pages: rest };
    }),
}));
