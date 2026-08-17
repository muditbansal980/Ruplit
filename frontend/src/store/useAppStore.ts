"use client";

import { create } from "zustand";

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  /** Language code chosen on the home screen, e.g. "hi-IN" */
  selectedLanguageCode: string;
  setSelectedLanguage: (code: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  selectedLanguageCode: "",
  setSelectedLanguage: (code) => {
    console.log(`[useAppStore] setSelectedLanguage — code="${code}"`);
    set({ selectedLanguageCode: code });
  },
}));
