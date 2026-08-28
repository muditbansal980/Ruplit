import { Reveal } from "./Reveal";

export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="border-y border-ink/10 bg-white"
    >
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <h2
            id="problem-heading"
            className="font-display text-2xl font-bold tracking-tight text-ink/50 sm:text-3xl"
          >
            Why banking apps fail most people
          </h2>
          <p className="mt-6 text-2xl leading-snug font-bold text-ink sm:text-3xl sm:leading-snug">
            Most apps assume you can read small print, in English, on your own.
            Millions can&apos;t — so they hand their phone — and their money —
            to someone else{" "}
            <span className="bg-marigold/40 box-decoration-clone px-1">
              and hope for the best.
            </span>
          </p>
          <p className="mt-6 text-xl leading-relaxed text-ink/70">
            Money is too important to hand to a stranger. It should speak to
            you directly.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
