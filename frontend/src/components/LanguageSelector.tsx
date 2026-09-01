"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LANGUAGES, type Language } from "@/data/languages";
import { speak } from "@/lib/speech";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageDropdown from "./ui/LanguageDropdown";
import LanguageCard from "./ui/LanguageCard";
import OkButton from "./ui/OkButton";
import SpeakButton from "./ui/SpeakButton";

export default function LanguageSelector() {
  const { language: selectedLanguageCode, setLanguage: setSelectedLanguage } = useLanguage();
  const [confirmedLanguage, setConfirmedLanguage] = useState<Language | null>(null);
  const [showArrow, setShowArrow] = useState(false);

  // Guards against the effect running twice in dev (React StrictMode).
  const introSpoken = useRef(false);

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((lang) => lang.code === selectedLanguageCode) ?? null,
    [selectedLanguageCode]
  );

  // On first load: announce in the detected language that it can be
  // changed, and point an arrow at the dropdown.
  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;

    setShowArrow(true);
    if (selectedLanguage) {
      speak(selectedLanguage.changePhrase, selectedLanguage.code);
    }
  }, [selectedLanguage]);

  /** Page title in the current UI language */
  const pageTitle = selectedLanguage?.nativeTitle ?? LANGUAGES[0].nativeTitle;
  /** "Choose a language" in the current UI language */
  const dropdownPlaceholder =
    selectedLanguage?.nativeLabel ?? LANGUAGES[0].nativeLabel;

  const handleSelect = (code: string) => {
    console.log(`[LanguageSelector] handleSelect — code="${code}"`);
    const lang = LANGUAGES.find((l) => l.code === code) ?? null;
    setSelectedLanguage(code);
    setConfirmedLanguage(null); // a new selection invalidates the previous confirmation
    setShowArrow(false); // the user found the dropdown, no need for the arrow

    // Automatically speak which language was chosen.
    if (lang) {
      speak(lang.speechPhrase, lang.code);
    }
  };

  const handleConfirm = () => {
    console.log(
      `[LanguageSelector] handleConfirm — selectedLanguageCode="${selectedLanguageCode}"`
    );
    setShowArrow(false);
    if (selectedLanguage) {
      setConfirmedLanguage(selectedLanguage);
    } else {
      console.warn("[LanguageSelector] OK pressed but no language is selected yet");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <h1 className="text-center text-3xl font-bold">{pageTitle}</h1>

      {/* Selection: dropdown + OK button */}
      <section className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        {showArrow && (
          <div className="flex flex-col items-center gap-1">
            <span className="animate-bounce text-3xl">👇</span>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {dropdownPlaceholder}
            </span>
          </div>
        )}
        <LanguageDropdown
          languages={LANGUAGES}
          value={selectedLanguageCode}
          placeholder={dropdownPlaceholder}
          onChange={handleSelect}
        />
        <OkButton
          label={selectedLanguage?.nativeOk ?? LANGUAGES[0].nativeOk}
          disabled={!selectedLanguage}
          onClick={handleConfirm}
        />
      </section>

      {/* Confirmation after pressing OK */}
      {confirmedLanguage && (
        <section
          className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-green-600/40 bg-green-50 p-5 dark:bg-green-950/30"
          aria-live="polite"
        >
          <p className="flex-1 text-xl font-medium">
            {confirmedLanguage.speechPhrase}
          </p>
          <SpeakButton
            phrase={confirmedLanguage.speechPhrase}
            langCode={confirmedLanguage.code}
            ariaLabel={`Listen again in ${confirmedLanguage.name}`}
          />
        </section>
      )}

      {/* Every language as a big card with a voice button */}
      <section className="flex w-full max-w-md flex-col gap-3">
        {LANGUAGES.map((lang) => (
          <LanguageCard
            key={lang.code}
            language={lang}
            isSelected={lang.code === selectedLanguageCode}
            onSelect={handleSelect}
          />
        ))}
      </section>
    </main>
  );
}
