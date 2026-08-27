"use client";

import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  activeDialog: string | null;
  toggleSidebar: () => void;
  openDialog: (id: string) => void;
  closeDialog: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  activeDialog: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openDialog: (id) => set({ activeDialog: id }),
  closeDialog: () => set({ activeDialog: null }),
}));
