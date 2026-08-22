"use client";

import { create } from "zustand";

interface AppState {
  selectedLanguageCode: string;
  setSelectedLanguage: (code: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguageCode: "",
  setSelectedLanguage: (code) => {
    console.log(`[useAppStore] setSelectedLanguage — code="${code}"`);
    set({ selectedLanguageCode: code });
  },
}));
