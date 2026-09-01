"use client";

// Re-export from new stores for backward compatibility
export { useAuthStore } from "./authStore";
export { useLanguageStore } from "./languageStore";

import { useLanguageStore } from "./languageStore";

// Legacy interface for backward compatibility
interface AppState {
  selectedLanguageCode: string;
  setSelectedLanguage: (code: string) => void;
}

export function useAppStore(): AppState {
  const { selectedLanguageCode, setLanguage } = useLanguageStore();
  return {
    selectedLanguageCode,
    setSelectedLanguage: setLanguage,
  };
}
