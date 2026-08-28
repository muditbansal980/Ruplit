import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  Atkinson_Hyperlegible,
  Bricolage_Grotesque,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LANG_COOKIE } from "@/lib/cookieLang";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BankSaathi — Banking that speaks your language",
  description:
    "BankSaathi reads every screen out loud in the language you choose, guides you with an AI saathi, and connects you to a real person when you want one. Banking made for first-time users.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  // Extract the primary language code (e.g. "hi" from "hi-IN")
  const htmlLang = langCookie?.split("-")[0] ?? "en";

  return (
    <html
      lang={htmlLang}
      className={`${atkinson.variable} ${bricolage.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers initialLanguage={htmlLang}>{children}</Providers>
      </body>
    </html>
  );
}
