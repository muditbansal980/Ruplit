import {
  BotMessageSquare,
  HandCoins,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: Volume2,
    tint: "bg-marigold/25 text-marigold-deep",
    title: "Hear every screen",
    body: "Tap the speaker on any page and BankSaathi reads it out loud — your balance, the buttons, the warnings — in your language. You never have to read a screen to use it.",
  },
  {
    icon: BotMessageSquare,
    tint: "bg-leaf/15 text-leaf-deep",
    title: "Ask, don't decode",
    body: "Say what you need in your own words — \"send ₹500 to Meena\" — and your AI saathi does it with you, step by step, explaining each step as it goes.",
  },
  {
    icon: HandCoins,
    tint: "bg-marigold/25 text-marigold-deep",
    title: "Keep track of what you lend",
    body: "Money lent to family and neighbours usually lives in your head. BankSaathi keeps a simple record of what you gave, what came back, and what's still out — and can remind for you, politely.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-leaf/15 text-leaf-deep",
    title: "Share documents without worry",
    body: "Your KYC happens through Setu's Account Aggregator: your statements travel straight from your bank to BankSaathi, encrypted. No photos of documents. No passwords shared with anyone.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-16 bg-mist"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <p className="text-sm font-bold tracking-widest text-marigold-deep uppercase">
            What you can do
          </p>
          <h2
            id="features-heading"
            className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Built for your hands, your ears, your language
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <article className="flex h-full flex-col gap-4 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl ${feature.tint}`}
                >
                  <feature.icon className="size-7" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed text-ink/70">
                  {feature.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
