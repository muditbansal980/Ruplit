export interface NamasteGreeting {
  /** BCP-47 language tag */
  langCode: string;
  /** The greeting text in the native script */
  greeting: string;
  /** English transliteration / description */
  english: string;
  /** The full spoken phrase */
  spokenPhrase: string;
}

export const NAMASTE_GREETINGS: NamasteGreeting[] = [
  {
    langCode: "hi-IN",
    greeting: "नमस्ते",
    english: "Namaste",
    spokenPhrase: "नमस्ते! आपका स्वागत है।",
  },
  {
    langCode: "en-IN",
    greeting: "Hello!",
    english: "Hello",
    spokenPhrase: "Hello! Welcome!",
  },
  {
    langCode: "bn-IN",
    greeting: "নমস্কার",
    english: "Nomoshkar",
    spokenPhrase: "নমস্কার! স্বাগতম!",
  },
  {
    langCode: "ta-IN",
    greeting: "வணக்கம்",
    english: "Vanakkam",
    spokenPhrase: "வணக்கம்! வரவேற்கிறோம்!",
  },
  {
    langCode: "te-IN",
    greeting: "నమస్తే",
    english: "Namaste",
    spokenPhrase: "నమస్తే! స్వాగతం!",
  },
  {
    langCode: "kn-IN",
    greeting: "ನಮಸ್ಕಾರ",
    english: "Namaskara",
    spokenPhrase: "ನಮಸ್ಕಾರ! ಸ್ವಾಗತ!",
  },
];

/** Returns the greeting for a given language code, or Hindi as default. */
export function getNamasteForLang(code: string): NamasteGreeting {
  return (
    NAMASTE_GREETINGS.find((g) => g.langCode === code) ??
    NAMASTE_GREETINGS[0]
  );
}
