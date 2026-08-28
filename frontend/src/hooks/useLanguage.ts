"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/data/languages";
import { detectSystemLanguage } from "@/lib/detectSystemLanguage";
import { setLanguageCookie } from "@/lib/cookieLang";

/**
 * Single hook for all language needs.
 *
 * Source of truth: i18n.language (initialized from cookie by the server).
 * The cookie is the persisted source; i18n is the runtime source.
 * They are always kept in sync.
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const hasDetected = useRef(false);

  // On first client mount (fresh browser, no cookie), detect system language
  // and set it. This runs AFTER hydration so it never causes a mismatch.
  useEffect(() => {
    if (hasDetected.current) return;
    hasDetected.current = true;

    // If i18n already has a real language (from cookie via server), skip.
    // Only detect when the default "en" was used because no cookie existed.
    // We check the cookie directly to know if one existed at request time.
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("banksahayak-lang="));

    if (!hasCookie) {
      const detected = detectSystemLanguage();
      const primary = detected.code.split("-")[0];
      if (i18n.language !== primary) {
        i18n.changeLanguage(primary);
      }
      setLanguageCookie(detected.code);
    }
  }, [i18n]);

  const setLanguage = useCallback(
    (code: string) => {
      const primary = code.split("-")[0];
      // Update cookie (source of persisted truth)
      setLanguageCookie(code);
      // Update i18n (source of runtime truth)
      if (i18n.language !== primary) {
        i18n.changeLanguage(primary);
      }
    },
    [i18n]
  );

  // Derive current language from i18n.language (the single source of truth)
  const currentLanguage = LANGUAGES.find(
    (l) => l.code.split("-")[0] === i18n.language
  );

  return {
    language: currentLanguage?.code ?? "en-IN",
    currentLanguage: currentLanguage ?? LANGUAGES[0],
    setLanguage,
    detectedLanguage: detectSystemLanguage(),
    languages: LANGUAGES,
  };
}
