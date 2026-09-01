"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Hand, Volume2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { landingLanguages } from "./languages";

function speakPhrase(text: string, bcp47: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = bcp47;
  utterance.rate = 0.95;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

const fadeSwap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export function Hero() {
  const reduced = useReducedMotion();
  const [langIndex, setLangIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const touched = useRef(false);
  const lang = landingLanguages[langIndex];

  const switchTo = useCallback((index: number) => {
    touched.current = true;
    setLangIndex(index);
    const target = landingLanguages[index];
    setSpeaking(true);
    speakPhrase(target.greeting, target.bcp47, () => setSpeaking(false));
  }, []);

  // Gently demo the switch until the visitor takes over.
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (touched.current) {
        window.clearInterval(timer);
        return;
      }
      setLangIndex((i) => (i + 1) % landingLanguages.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-mist"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-marigold/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-leaf/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pt-24 lg:pb-24">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-leaf/25 bg-white px-4 py-2 text-sm font-bold text-leaf-deep"
          >
            <Volume2 className="size-4 text-marigold-deep" aria-hidden />
            A banking app that talks with you
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Banking that speaks{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">your language</span>
              <svg
                aria-hidden
                viewBox="0 0 220 14"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-1 z-0 h-3 w-full text-marigold"
              >
                <path
                  d="M4 10 C 60 2, 160 2, 216 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            . Literally.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl"
          >
            BankSaathi reads every screen out loud and explains money in plain
            words — in the language you pick below. And when you want a real
            person, your saathi is one tap away.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/select-language"
              className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-leaf px-8 text-lg font-bold text-white shadow-lg shadow-leaf/25 transition-all hover:bg-leaf-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
            >
              Get started
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-14 items-center rounded-2xl px-4 text-lg font-bold text-leaf-deep underline decoration-marigold decoration-4 underline-offset-8 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.36 }}
            className="mt-6 text-base font-bold text-ink/55"
          >
            Free to try · Works on any phone · Your data stays yours
          </motion.p>
        </div>

        {/* Signature element: the live language switch. Tap a language and the
            whole screen retells itself, out loud. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div
            className="rounded-[2rem] border border-ink/10 bg-white p-4 shadow-2xl shadow-leaf/15 sm:p-5"
            role="group"
            aria-label="Preview of the BankSaathi app screen"
          >
            {/* App header */}
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-ink/60">
                BankSaathi
              </span>
              <button
                type="button"
                onClick={() => switchTo(langIndex)}
                aria-label={`Listen in ${lang.nativeName}`}
                className="relative flex size-14 items-center justify-center rounded-full bg-marigold text-ink shadow-md shadow-marigold/40 transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-leaf"
              >
                <Volume2 className="size-6" aria-hidden />
                {speaking && !reduced && (
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full bg-marigold/50"
                  />
                )}
              </button>
            </div>

            {/* Greeting from the saathi */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-mist p-4">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-leaf font-display text-sm font-bold text-white"
              >
                स
              </span>
              <p
                lang={lang.code}
                className="min-h-12 pt-1 text-base font-bold leading-snug text-ink"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lang.code}
                    {...fadeSwap}
                    className="block"
                  >
                    {lang.greeting}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>

            {/* Balance */}
            <div className="mt-3 rounded-2xl bg-leaf-deep p-4 text-white">
              <p className="text-sm font-bold text-white/70">
                <AnimatePresence mode="wait">
                  <motion.span key={lang.code} {...fadeSwap} className="block">
                    {lang.balanceLabel}
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="mt-1 font-display text-3xl font-bold">₹4,280.00</p>
            </div>

            {/* Transactions */}
            <ul className="mt-3 space-y-2">
              {[
                { label: lang.sentLabel, amount: "− ₹500", arrow: "↑" },
                { label: lang.receivedLabel, amount: "+ ₹1,200", arrow: "↓" },
              ].map((row) => (
                <li
                  key={row.arrow}
                  className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-3"
                >
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-full bg-mist text-ink"
                  >
                    <Hand className="size-4" />
                  </span>
                  <span
                    lang={lang.code}
                    className="min-h-6 flex-1 text-sm font-bold text-ink"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span key={lang.code} {...fadeSwap} className="block">
                        {row.label}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-sm font-bold text-ink/70">
                    {row.amount}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakPhrase(row.label, lang.bcp47)}
                    aria-label={`Listen: ${row.label}`}
                    className="flex size-11 items-center justify-center rounded-full text-leaf-deep transition-colors hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                  >
                    <Volume2 className="size-5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Language chips */}
          <div className="mt-6" role="group" aria-label="Choose a language">
            <div className="flex flex-wrap justify-center gap-2.5">
              {landingLanguages.map((l, index) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchTo(index)}
                  aria-pressed={index === langIndex}
                  lang={l.code}
                  className={`min-h-11 rounded-full border px-5 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-leaf ${
                    index === langIndex
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ink hover:border-ink/40"
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-bold text-ink/55">
              Tap a language — hear the difference
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
