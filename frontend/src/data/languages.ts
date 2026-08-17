export interface Language {
  /** BCP-47 language tag, used for speech synthesis (e.g. "hi-IN") */
  code: string;
  /** Language name in English */
  name: string;
  /** Language name written in its own script (e.g. "हिन्दी") */
  nativeName: string;
  /** "Choose a language" in this language */
  nativeLabel: string;
  /** "OK" in this language */
  nativeOk: string;
  /** "You have chosen <language>" in this language — used for the voice announcement */
  speechPhrase: string;
  /** "Choose your language" page title in this language */
  nativeTitle: string;
  /**
   * Spoken hint, in this language: "You have chosen <language>. If you want
   * to change it, please choose from the dropdown below."
   */
  changePhrase: string;
}

export const LANGUAGES: Language[] = [
  {
    code: "en-IN",
    name: "English",
    nativeName: "English",
    nativeLabel: "Choose a language",
    nativeOk: "OK",
    speechPhrase: "You have chosen English",
    nativeTitle: "Choose your language",
    changePhrase:
      "You have chosen English. If you want to change the language, please choose from the dropdown below.",
  },
  {
    code: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    nativeLabel: "भाषा चुनें",
    nativeOk: "ठीक है",
    speechPhrase: "आपने हिन्दी भाषा चुनी है",
    nativeTitle: "अपनी भाषा चुनें",
    changePhrase:
      "आपने हिन्दी भाषा चुनी है। अगर आप भाषा बदलना चाहते हैं, तो कृपया नीचे दिए गए विकल्प में से चुनें।",
  },
  {
    code: "ml-IN",
    name: "Malayalam",
    nativeName: "മലയാളം",
    nativeLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    nativeOk: "ശരി",
    speechPhrase: "നിങ്ങൾ മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു",
    nativeTitle: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    changePhrase:
      "നിങ്ങൾ മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു. ഭാഷ മാറ്റണമെങ്കിൽ, ദയവായി താഴെയുള്ള ഓപ്ഷനിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.",
  },
  {
    code: "bn-IN",
    name: "Bengali",
    nativeName: "বাংলা",
    nativeLabel: "ভাষা নির্বাচন করুন",
    nativeOk: "ঠিক আছে",
    speechPhrase: "আপনি বাংলা ভাষা বেছে নিয়েছেন",
    nativeTitle: "আপনার ভাষা নির্বাচন করুন",
    changePhrase:
      "আপনি বাংলা ভাষা বেছে নিয়েছেন। ভাষা পরিবর্তন করতে চাইলে, অনুগ্রহ করে নিচের বিকল্প থেকে নির্বাচন করুন।",
  },
  {
    code: "ur-PK",
    name: "Urdu",
    nativeName: "اردو",
    nativeLabel: "زبان منتخب کریں",
    nativeOk: "ٹھیک ہے",
    speechPhrase: "آپ نے اردو زبان منتخب کی ہے",
    nativeTitle: "اپنی زبان منتخب کریں",
    changePhrase:
      "آپ نے اردو زبان منتخب کی ہے۔ اگر آپ زبان تبدیل کرنا چاہتے ہیں تو براہ کرم نیچے دیے گئے اختیار میں سے منتخب کریں۔",
  },
  {
    code: "ta-IN",
    name: "Tamil",
    nativeName: "தமிழ்",
    nativeLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
    nativeOk: "சரி",
    speechPhrase: "நீங்கள் தமிழ் மொழியைத் தேர்ந்தெடுத்துள்ளீர்கள்",
    nativeTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    changePhrase:
      "நீங்கள் தமிழ் மொழியைத் தேர்ந்தெடுத்துள்ளீர்கள். மொழியை மாற்ற விரும்பினால், கீழே உள்ள விருப்பத்திலிருந்து தேர்ந்தெடுக்கவும்.",
  },
  {
    code: "te-IN",
    name: "Telugu",
    nativeName: "తెలుగు",
    nativeLabel: "భాషను ఎంచుకోండి",
    nativeOk: "సరే",
    speechPhrase: "మీరు తెలుగు భాషను ఎంచుకున్నారు",
    nativeTitle: "మీ భాషను ఎంచుకోండి",
    changePhrase:
      "మీరు తెలుగు భాషను ఎంచుకున్నారు. భాష మార్చాలనుకుంటే, దయచేసి క్రింద ఉన్న ఎంపిక నుండి ఎంచుకోండి.",
  },
  {
    code: "pa-IN",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    nativeLabel: "ਭਾਸ਼ਾ ਚੁਣੋ",
    nativeOk: "ਠੀਕ ਹੈ",
    speechPhrase: "ਤੁਸੀਂ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਹੈ",
    nativeTitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    changePhrase:
      "ਤੁਸੀਂ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਹੈ। ਜੇ ਤੁਸੀਂ ਭਾਸ਼ਾ ਬਦਲਣੀ ਚਾਹੁੰਦੇ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪ ਵਿੱਚੋਂ ਚੁਣੋ।",
  },
  {
    code: "gu-IN",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    nativeLabel: "ભાષા પસંદ કરો",
    nativeOk: "બરાબર",
    speechPhrase: "તમે ગુજરાતી ભાષા પસંદ કરી છે",
    nativeTitle: "તમારી ભાષા પસંદ કરો",
    changePhrase:
      "તમે ગુજરાતી ભાષા પસંદ કરી છે. જો તમે ભાષા બદલવા માંગતા હો, તો કૃપા કરીને નીચેના વિકલ્પમાંથી પસંદ કરો.",
  },
  {
    code: "mr-IN",
    name: "Marathi",
    nativeName: "मराठी",
    nativeLabel: "भाषा निवडा",
    nativeOk: "ठीक आहे",
    speechPhrase: "तुम्ही मराठी भाषा निवडली आहे",
    nativeTitle: "तुमची भाषा निवडा",
    changePhrase:
      "तुम्ही मराठी भाषा निवडली आहे. जर तुम्हाला भाषा बदलायची असेल, तर कृपया खालील पर्यायातून निवडा.",
  },
  {
    code: "kn-IN",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    nativeLabel: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    nativeOk: "ಸರಿ",
    speechPhrase: "ನೀವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ",
    nativeTitle: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    changePhrase:
      "ನೀವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ. ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಲು ಬಯಸಿದರೆ, ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಆಯ್ಕೆಯಿಂದ ಆರಿಸಿ.",
  },
  {
    code: "or-IN",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    nativeLabel: "ଭାଷା ବାଛନ୍ତୁ",
    nativeOk: "ଠିକ୍ ଅଛି",
    speechPhrase: "ଆପଣ ଓଡ଼ିଆ ଭାଷା ଚୟନ କରିଛନ୍ତି",
    nativeTitle: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ",
    changePhrase:
      "ଆପଣ ଓଡ଼ିଆ ଭାଷା ଚୟନ କରିଛନ୍ତି। ଯଦି ଆପଣ ଭାଷା ବଦଳାଇବାକୁ ଚାହାଁନ୍ତି, ତେବେ ଦୟାକରି ତଳେ ଥିବା ବିକଳ୍ପରୁ ବାଛନ୍ତୁ।",
  },
];
