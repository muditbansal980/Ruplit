"use client";

import type { Language } from "@/data/languages";
import SpeakButton from "./SpeakButton";

interface LanguageCardProps {
  language: Language;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

export default function LanguageCard({
  language,
  isSelected,
  onSelect,
}: LanguageCardProps) {
  const handleSelect = () => {
    console.log(
      `[LanguageCard] select — code="${language.code}", nativeName="${language.nativeName}"`
    );
    onSelect(language.code);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
        isSelected
          ? "border-zinc-800 bg-zinc-100 dark:border-zinc-300 dark:bg-zinc-800"
          : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
      }`}
    >
      <button
        type="button"
        onClick={handleSelect}
        aria-pressed={isSelected}
        className="flex-1 rounded-xl px-2 py-1 text-left"
      >
        <span className="block text-2xl font-semibold">{language.nativeName}</span>
      </button>

      <SpeakButton
        phrase={language.speechPhrase}
        langCode={language.code}
        ariaLabel={`Listen: you have chosen ${language.name}`}
      />
    </div>
  );
}
