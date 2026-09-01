import { HandHeart, LockKeyhole, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Approved rails, not shortcuts",
    body: "We move your information through India's Account Aggregator system — the regulator-built framework that big banks use. In this demo we run on Setu's AA Sandbox, the same technology, safe for testing.",
  },
  {
    icon: LockKeyhole,
    title: "Bank-grade security",
    body: "Everything you share travels encrypted and stays encrypted. We never see your passwords, and nobody at BankSaathi can move your money.",
  },
  {
    icon: HandHeart,
    title: "You're in charge",
    body: "You decide what BankSaathi can see and for how long — and you can switch it off with one tap. Your data is yours; we only borrow it.",
  },
];

export function TrustSection() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="scroll-mt-16 bg-leaf-deep text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <p className="text-sm font-bold tracking-widest text-marigold uppercase">
            Trust & safety
          </p>
          <h2
            id="trust-heading"
            className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Why you can trust us with your money
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {trustPoints.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                  <point.icon className="size-6 text-marigold" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold">{point.title}</h3>
                <p className="text-lg leading-relaxed text-white/75">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-14 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 text-lg font-bold text-white/90">
            One promise: BankSaathi never asks for your PIN, OTP, or password.
            If someone does, it isn&apos;t us.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
