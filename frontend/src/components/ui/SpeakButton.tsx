"use client";

import { speak } from "@/lib/speech";

interface SpeakButtonProps {
  /** The phrase to speak out loud */
  phrase: string;
  /** BCP-47 language tag for the voice (e.g. "hi-IN") */
  langCode: string;
  /** Accessible label, e.g. "Listen in Hindi" */
  ariaLabel: string;
  className?: string;
}

export default function SpeakButton({
  phrase,
  langCode,
  ariaLabel,
  className,
}: SpeakButtonProps) {
  const handleSpeak = () => {
    console.log(`[SpeakButton] click — langCode="${langCode}", phrase="${phrase}"`);
    speak(phrase, langCode);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={
        className ??
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-2xl transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      }
    >
      🔊
    </button>
  );
}
