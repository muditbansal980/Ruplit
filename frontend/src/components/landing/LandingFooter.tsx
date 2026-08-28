import { Volume2 } from "lucide-react";

const footerLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#trust", label: "Trust & safety" },
  { href: "mailto:hello@banksaathi.in", label: "hello@banksaathi.in" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-leaf text-white">
            <Volume2 className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-display text-base font-bold text-ink">
              BankSaathi
            </p>
            <p className="text-sm font-bold text-ink/55">
              A saathi for your money.
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-base font-bold text-ink/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm font-bold text-ink/45">
          © {new Date().getFullYear()} BankSaathi
        </p>
      </div>
    </footer>
  );
}
