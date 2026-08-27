"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/languageStore";
import { LANGUAGES } from "@/data/languages";
import { detectSystemLanguage } from "@/lib/detectSystemLanguage";

export function useLanguage() {
  const { i18n } = useTranslation();
  const { selectedLanguageCode, setLanguage: setStoreLanguage } = useLanguageStore();

  // On mount, detect system language if nothing is stored
  useEffect(() => {
    if (!selectedLanguageCode) {
      const detected = detectSystemLanguage();
      setStoreLanguage(detected.code);
      i18n.changeLanguage(detected.code.split("-")[0]);
    }
  }, [selectedLanguageCode, setStoreLanguage, i18n]);

  const setLanguage = (code: string) => {
    setStoreLanguage(code);
    // i18next uses just the language part (e.g. "hi" from "hi-IN")
    i18n.changeLanguage(code.split("-")[0]);
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === selectedLanguageCode);

  return {
    language: selectedLanguageCode,
    currentLanguage,
    setLanguage,
    detectedLanguage: detectSystemLanguage(),
    languages: LANGUAGES,
  };
}
