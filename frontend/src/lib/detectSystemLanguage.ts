import { LANGUAGES, type Language } from "@/data/languages";

/**
 * Detects the user's system/browser language (navigator.language) and maps
 * it to the closest supported language. Falls back to English when there is
 * no match.
 */
export function detectSystemLanguage(): Language {
  if (typeof navigator === "undefined") {
    return LANGUAGES[0];
  }

  const raw = navigator.language || "en";
  const primary = raw.split("-")[0].toLowerCase();
  console.log(
    `[detectSystemLanguage] navigator.language="${raw}" → primary="${primary}"`
  );

  const match = LANGUAGES.find(
    (lang) => lang.code.split("-")[0].toLowerCase() === primary
  );
  const result = match ?? LANGUAGES[0];
  console.log(
    `[detectSystemLanguage] mapped to "${result.code}" (${result.name})`
  );
  return result;
}
