"use client";

import { useEffect, useRef } from "react";
import { LANGUAGES, type Language } from "@/data/languages";
import { enqueue, speakNow, cancelAll } from "@/lib/audioQueue";

interface Props {
  onSelect: (code: string) => void;
}

export default function LanguageScreen({ onSelect }: Props) {
  const hasNarrated = useRef(false);

  // Auto-narrate the greeting on first mount
  useEffect(() => {
    if (hasNarrated.current) return;
    hasNarrated.current = true;

    const timer = setTimeout(() => {
      enqueue("Welcome! Please select your language to continue.", "en-IN");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleHover = (lang: Language) => {
    cancelAll();
    speakNow(lang.greeting, lang.code);
  };

  const handleSelect = (lang: Language) => {
    cancelAll();
    // Play full welcome message, then transition
    speakNow(lang.welcomeMessage, lang.code);
    setTimeout(() => {
      onSelect(lang.code);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">🙏</div>
          <h1 className="mb-2 text-3xl font-bold text-black">
            Select Your Language
          </h1>
          <p className="text-base text-gray-500">
            Tap a language to hear a greeting
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang)}
              onMouseEnter={() => handleHover(lang)}
              onFocus={() => handleHover(lang)}
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-6 text-center transition hover:border-black hover:shadow-md active:scale-95"
              style={{ minHeight: 120 }}
              aria-label={`Select ${lang.name} language`}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {lang.icon}
              </span>
              <div>
                <p className="text-xl font-bold text-black">{lang.nativeName}</p>
                <p className="text-sm text-gray-400">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Audio hint */}
        <p className="mt-6 text-center text-xs text-gray-400">
          🔊 Hover or tap a card to hear the greeting
        </p>
      </div>
    </main>
  );
}
