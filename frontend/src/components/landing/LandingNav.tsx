import { Volume2 } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#trust", label: "Trust & safety" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-mist/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-leaf text-white">
            <Volume2 className="size-5" aria-hidden />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            BankSaathi
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-md px-4 text-base font-bold text-ink/80 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/select-language"
          className="inline-flex min-h-11 items-center rounded-xl bg-leaf px-5 font-bold text-white transition-colors hover:bg-leaf-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        >
          Get started
        </Link>
      </nav>
    </header>
  );
}
