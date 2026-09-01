import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import ta from "@/locales/ta.json";
import bn from "@/locales/bn.json";

/**
 * Initialize i18next with an explicit language.
 *
 * The language is determined server-side by reading the cookie in layout.tsx
 * and passed as a prop to <Providers>. This ensures server and client render
 * the SAME language on the very first render — no hydration mismatch.
 *
 * LanguageDetector is intentionally removed because it depends on
 * `document.cookie` / `localStorage` / `navigator`, none of which exist
 * during SSR, causing the server to always fall back to English.
 */
let initialized = false;

export function initI18n(lng: string) {
  if (initialized) {
    // On re-renders (e.g. language change), just switch language.
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
    return;
  }

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      bn: { translation: bn },
    },
    lng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  initialized = true;
}

export default i18n;
