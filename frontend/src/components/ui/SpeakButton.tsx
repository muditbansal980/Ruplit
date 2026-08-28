"use client";

import { speak } from "@/lib/speech";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Slow "breathing" pulse: the one continuous motion on the page, so a
  // first-time user can tell this button is alive and tappable.
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(button, {
      scale: 1.05,
      duration: 0.75,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  const handleSpeak = () => {
    console.log(`[SpeakButton] click — langCode="${langCode}", phrase="${phrase}"`);
    speak(phrase, langCode);
  };

  return (
    <button
      ref={buttonRef}
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
