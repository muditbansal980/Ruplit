"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  selectedLanguageCode: string;
  setLanguage: (code: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageCode: "",
      setLanguage: (code) => set({ selectedLanguageCode: code }),
    }),
    {
      name: "banksahayak-language",
    }
  )
);
