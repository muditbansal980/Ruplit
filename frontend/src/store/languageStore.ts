"use client";

import { create } from "zustand";
import { setLanguageCookie } from "@/lib/cookieLang";

interface LanguageState {
  selectedLanguageCode: string;
  setLanguage: (code: string) => void;
}

/**
 * Minimal Zustand store kept for backward compatibility with components
 * that import useLanguageStore directly. The authoritative source of
 * truth is the cookie + i18n. This store is NOT persisted to localStorage.
 */
export const useLanguageStore = create<LanguageState>()((set) => ({
  selectedLanguageCode: "",
  setLanguage: (code) => {
    set({ selectedLanguageCode: code });
    setLanguageCookie(code);
  },
}));
