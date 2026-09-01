import { LANGUAGES, type Language } from "@/data/languages";

/**
 * Returns all available languages.
 *
 * Previously this filtered by browser voice support, but that hid languages
 * users legitimately wanted to select. The SpeakButton already handles
 * missing voices gracefully (silently no-ops), so there is no need to
 * hide languages from the UI.
 */
export function getSupportedLanguages(): Language[] {
  return LANGUAGES;
}
