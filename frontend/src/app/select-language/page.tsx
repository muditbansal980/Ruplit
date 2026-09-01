"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageCard from "@/components/ui/LanguageCard";
import OkButton from "@/components/ui/OkButton";
import SpeakButton from "@/components/ui/SpeakButton";
import { speak } from "@/lib/speech";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A small friendly face that bobs and blinks. Pure inline SVG + GSAP, so
 * there is nothing to load — safe on low-end devices and slow networks.
 */
function SaathiFace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tweens = [
      gsap.to(svgRef.current, {
        y: -3,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
      gsap
        .timeline({ repeat: -1, repeatDelay: 3 })
        .to(eyesRef.current, {
          scaleY: 0.15,
          duration: 0.08,
          ease: "power1.out",
          transformOrigin: "center center",
        })
        .to(eyesRef.current, { scaleY: 1, duration: 0.12, ease: "power1.out" }),
    ];
    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      aria-hidden="true"
      className="mx-auto"
    >
      <circle cx="28" cy="28" r="24" fill="#1E5C4E" />
      <g ref={eyesRef}>
        <circle cx="20" cy="24" r="2.6" fill="#fff" />
        <circle cx="36" cy="24" r="2.6" fill="#fff" />
      </g>
      <path
        d="M19 34 Q28 41 37 34"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { language, currentLanguage, setLanguage, languages, detectedLanguage } = useLanguage();
  const [confirmed, setConfirmed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const hasSpokenDetected = useRef(false);

  // Calm guided reveal: header first, then one language at a time, then OK.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { duration: 0.4, ease: "power2.out" } })
        .from("[data-anim='header']", { opacity: 0, y: -12 })
        .from(".lang-card", { opacity: 0, y: 16, stagger: 0.09 }, "-=0.1")
        .from("[data-anim='ok']", { opacity: 0, y: 12 }, "-=0.2");
    }, mainRef);
    return () => ctx.revert();
  }, []);

  // Auto-speak the detected language's speech phrase once on mount.
  useEffect(() => {
    if (hasSpokenDetected.current) return;
    if (!detectedLanguage) return;
    // Small delay so voices have time to load
    const timer = setTimeout(() => {
      hasSpokenDetected.current = true;
      speak(detectedLanguage.speechPhrase, detectedLanguage.code);
    }, 400);
    return () => clearTimeout(timer);
  }, [detectedLanguage]);

  // Confirmation banner slides in softly when it appears.
  useEffect(() => {
    if (!confirmed || prefersReducedMotion()) return;
    const banner = mainRef.current?.querySelector("[data-anim='banner']");
    if (!banner) return;
    gsap.from(banner, { opacity: 0, y: 10, duration: 0.3, ease: "power2.out" });
  }, [confirmed]);

  const handleConfirm = () => {
    if (!language) return;
    setConfirmed(true);

    if (prefersReducedMotion()) {
      window.setTimeout(() => router.push("/greeting"), 400);
      return;
    }

    // Proof before change: pop the chosen card, hold a beat so the user sees
    // their tap land, then crossfade forward — a continuation, not a cut.
    const card = mainRef.current?.querySelector(
      `[data-lang-code="${language}"]`
    );
    const timeline = gsap.timeline({
      onComplete: () => router.push("/greeting"),
    });
    if (card) {
      timeline
        .to(card, { scale: 1.03, duration: 0.18, ease: "power1.out" })
        .to(card, { scale: 1, duration: 0.18, ease: "power1.inOut" });
    }
    timeline
      .to({}, { duration: 0.25 })
      .to(mainRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.35,
        ease: "power2.out",
      });
  };

  return (
    <main
      ref={mainRef}
      className="flex min-h-screen flex-col items-center gap-8 p-8"
    >
      <div data-anim="header" className="flex flex-col items-center gap-3">
        <SaathiFace />
        <h1 className="text-center text-3xl font-bold">
          {currentLanguage?.nativeTitle || "Choose your language"}
        </h1>
      </div>

      {confirmed && currentLanguage && (
        <section
          data-anim="banner"
          className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-green-600/40 bg-green-50 p-5 dark:bg-green-950/30"
          aria-live="polite"
        >
          <p className="flex-1 text-xl font-medium">
            {currentLanguage.speechPhrase}
          </p>
          <SpeakButton
            phrase={currentLanguage.speechPhrase}
            langCode={currentLanguage.code}
            ariaLabel={`Listen again in ${currentLanguage.name}`}
          />
        </section>
      )}

      <section className="flex w-full max-w-md flex-col gap-3">
        {languages.map((lang) => (
          <LanguageCard
            key={lang.code}
            language={lang}
            isSelected={lang.code === language}
            onSelect={setLanguage}
          />
        ))}
      </section>

      <div data-anim="ok">
        <OkButton
          label={currentLanguage?.nativeOk || "OK"}
          disabled={!language}
          onClick={handleConfirm}
        />
      </div>
    </main>
  );
}
