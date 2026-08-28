"use client";

import type { Language } from "@/data/languages";
import { speak } from "@/lib/speech";
import { gsap } from "gsap";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);

  // Short "your tap landed" pop. The persistent border/background change and
  // the checkmark carry the actual state — this motion only confirms it.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isSelected) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap
      .timeline()
      .to(card, { scale: 1.03, duration: 0.15, ease: "power1.out" })
      .to(card, { scale: 1, duration: 0.2, ease: "power1.inOut" });
    return () => {
      tween.kill();
    };
  }, [isSelected]);

  const handleSelect = () => {
    console.log(
      `[LanguageCard] select — code="${language.code}", nativeName="${language.nativeName}"`
    );
    onSelect(language.code);
    speak(language.speechPhrase, language.code);
  };

  return (
    <div
      ref={cardRef}
      data-lang-code={language.code}
      className={`lang-card flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
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
        <span className="flex items-center gap-2">
          <span className="block text-2xl font-semibold">{language.nativeName}</span>
          {isSelected && (
            <Check
              className="size-6 text-green-700 dark:text-green-400"
              aria-hidden
            />
          )}
        </span>
      </button>

      <SpeakButton
        phrase={language.speechPhrase}
        langCode={language.code}
        ariaLabel={`Listen: you have chosen ${language.name}`}
      />
    </div>
  );
}
