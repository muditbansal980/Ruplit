"use client";

import { useState } from "react";
import LanguageScreen from "@/components/screens/LanguageScreen";
import VerificationScreen from "@/components/screens/VerificationScreen";
import { cancelAll } from "@/lib/audioQueue";

export default function Home() {
  const [languageCode, setLanguageCode] = useState<string | null>(null);

  const handleLanguageSelect = (code: string) => {
    cancelAll(); // Stop any queued audio
    setLanguageCode(code);
  };

  const handleBack = () => {
    cancelAll();
    setLanguageCode(null);
  };

  if (!languageCode) {
    return <LanguageScreen onSelect={handleLanguageSelect} />;
  }

  return <VerificationScreen languageCode={languageCode} onBack={handleBack} />;
}
