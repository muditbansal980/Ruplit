"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, HandCoins, Volume2 } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Pick your language",
    body: "English, हिन्दी, বাংলা, தமிழ், తెలుగు, मराठी and more. Switch any time — the whole app changes with you, instantly.",
    visual: (
      <div className="flex flex-wrap gap-2" aria-hidden>
        {["English", "हिन्दी", "বাংলা", "தமிழ்"].map((name, i) => (
          <span
            key={name}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
              i === 1
                ? "border-ink bg-ink text-white"
                : "border-ink/15 bg-white text-ink"
            }`}
          >
            {name}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    title: "Meet your saathi",
    body: "An AI helper that listens and acts with you — and a real person on call whenever you'd rather talk to a human. Both speak your language.",
    visual: (
      <div className="space-y-2.5" aria-hidden>
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-leaf-deep px-4 py-2.5 text-sm font-bold text-white">
            I want to open an account
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf text-white">
            <MessageCircle className="size-4" />
          </span>
          <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-mist px-4 py-2.5 text-sm font-bold text-ink">
            Of course! What should we call you?
          </p>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-marigold/30 text-marigold-deep">
            <Volume2 className="size-4" />
          </span>
        </div>
        <p className="pl-9 text-xs font-bold text-ink/50">
          Prefer a person? Tap the human icon and a trained saathi joins you.
        </p>
      </div>
    ),
  },
  {
    number: "03",
    title: "See your money, simply",
    body: "Big numbers, plain words, no jargon. What came in, what went out, what you lent your neighbour — on one calm screen.",
    visual: (
      <div className="grid grid-cols-2 gap-2.5" aria-hidden>
        <div className="rounded-2xl bg-leaf-deep p-3.5 text-white">
          <p className="text-xs font-bold text-white/70">In your hand</p>
          <p className="mt-1 font-display text-xl font-bold">₹4,280</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink/60">
            <HandCoins className="size-3.5 text-marigold-deep" />
            You lent Meena
          </p>
          <p className="mt-1 font-display text-xl font-bold text-ink">₹500</p>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".hiw-steps",
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );
      gsap.utils.toArray<HTMLElement>(".hiw-step").forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: step, start: "top 78%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-heading"
      className="scroll-mt-16 bg-white"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-bold tracking-widest text-marigold-deep uppercase">
            Three steps
          </p>
          <h2
            id="how-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            From hello to banking, in minutes
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">
            No paperwork marathon. No English test. You talk, BankSaathi
            listens, and things get done.
          </p>
        </div>

        <ol className="hiw-steps relative space-y-14 pl-10 sm:pl-14">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[9px] w-0.5 bg-ink/10 sm:left-[13px]"
          />
          <span
            aria-hidden
            className="hiw-line-fill absolute top-2 bottom-2 left-[9px] w-0.5 origin-top bg-leaf sm:left-[13px]"
          />
          {steps.map((step) => (
            <li key={step.number} className="hiw-step relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-10 flex size-5 items-center justify-center rounded-full border-2 border-leaf bg-white sm:-left-14 sm:size-7"
              />
              <p
                aria-hidden
                className="font-display text-sm font-bold text-marigold-deep"
              >
                {step.number}
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-md text-lg leading-relaxed text-ink/70">
                {step.body}
              </p>
              <div className="mt-5 max-w-sm rounded-2xl border border-ink/10 bg-mist/60 p-4">
                {step.visual}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
