"use client";

import { useCallback } from "react";
import { speak as libSpeak } from "@/lib/speech";

export function useSpeak() {
  const speak = useCallback((text: string, langCode: string) => {
    libSpeak(text, langCode);
  }, []);

  return { speak };
}
