"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageCard from "@/components/ui/LanguageCard";
import OkButton from "@/components/ui/OkButton";
import SpeakButton from "@/components/ui/SpeakButton";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { language, currentLanguage, setLanguage, languages } = useLanguage();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (language) {
      setConfirmed(true);
      setTimeout(() => {
        router.push("/greeting");
      }, 1500);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <h1 className="text-center text-3xl font-bold">
        {currentLanguage?.nativeTitle || "Choose your language"}
      </h1>

      {confirmed && currentLanguage && (
        <section
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

      <OkButton
        label={currentLanguage?.nativeOk || "OK"}
        disabled={!language}
        onClick={handleConfirm}
      />
    </main>
  );
}
