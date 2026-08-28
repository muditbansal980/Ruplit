import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-mist"
    >
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <Reveal>
          <h2
            id="cta-heading"
            className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink/70">
            Takes about two minutes. Pick your language first — you can change
            it any time.
          </p>
          <div className="mt-10">
            <Link
              href="/select-language"
              className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-marigold px-10 text-lg font-bold text-ink shadow-lg shadow-marigold/30 transition-all hover:bg-marigold-deep hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
            >
              Get started with BankSaathi
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
