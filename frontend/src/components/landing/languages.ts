export type LandingLanguage = {
  code: string;
  /** BCP 47 tag used for speech synthesis + lang attributes */
  bcp47: string;
  nativeName: string;
  greeting: string;
  balanceLabel: string;
  sentLabel: string;
  receivedLabel: string;
};

export const landingLanguages: LandingLanguage[] = [
  {
    code: "en",
    bcp47: "en-IN",
    nativeName: "English",
    greeting: "Hello! I'm your Saathi.",
    balanceLabel: "Your money",
    sentLabel: "Sent to Meena",
    receivedLabel: "Came from Ravi",
  },
  {
    code: "hi",
    bcp47: "hi-IN",
    nativeName: "हिन्दी",
    greeting: "नमस्ते! मैं आपकी साथी हूँ।",
    balanceLabel: "आपका पैसा",
    sentLabel: "मीना को भेजा",
    receivedLabel: "रवि से आया",
  },
  {
    code: "bn",
    bcp47: "bn-IN",
    nativeName: "বাংলা",
    greeting: "নমস্কার! আমি আপনার সাথী।",
    balanceLabel: "আপনার টাকা",
    sentLabel: "মীনাকে পাঠানো",
    receivedLabel: "রবির কাছ থেকে এসেছে",
  },
  {
    code: "ta",
    bcp47: "ta-IN",
    nativeName: "தமிழ்",
    greeting: "வணக்கம்! நான் உங்கள் சாதி.",
    balanceLabel: "உங்கள் பணம்",
    sentLabel: "மீனாவுக்கு அனுப்பியது",
    receivedLabel: "ரவியிடமிருந்து வந்தது",
  },
  {
    code: "te",
    bcp47: "te-IN",
    nativeName: "తెలుగు",
    greeting: "నమస్కారం! నేను మీ సాథీ.",
    balanceLabel: "మీ డబ్బు",
    sentLabel: "మీనాకు పంపారు",
    receivedLabel: "రవి నుండి వచ్చింది",
  },
  {
    code: "mr",
    bcp47: "mr-IN",
    nativeName: "मराठी",
    greeting: "नमस्कार! मी तुमची साथी आहे.",
    balanceLabel: "तुमचे पैसे",
    sentLabel: "मीनाला पाठवले",
    receivedLabel: "रवीकडून आले",
  },
];
