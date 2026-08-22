export interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
  greeting: string;
  welcomeMessage: string;
  verification: {
    title: string;
    steps: {
      aadhaar: string;
      kyc: string;
      bank: string;
      income: string;
    };
    status: {
      notStarted: string;
      inProgress: string;
      completed: string;
    };
    progress: string;
    stepUnlocked: string;
  };
}

export const LANGUAGES: Language[] = [
  {
    code: "en-IN",
    name: "English",
    nativeName: "English",
    icon: "🗣️",
    greeting: "Hello! Welcome.",
    welcomeMessage: "Welcome! Let's get you verified so you can access loans. This will be simple and quick.",
    verification: {
      title: "Verification Steps",
      steps: {
        aadhaar: "Aadhaar Verification",
        kyc: "KYC Verification",
        bank: "Bank Account Linking",
        income: "Income Proof Upload",
      },
      status: {
        notStarted: "Not Started",
        inProgress: "In Progress",
        completed: "Completed",
      },
      progress: "Step {n} of 4",
      stepUnlocked: "Now we'll verify your {step}. Tap the button to continue.",
    },
  },
  {
    code: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    icon: "🙏",
    greeting: "नमस्ते! स्वागत है।",
    welcomeMessage: "स्वागत है! आइए आपका सत्यापन करते हैं ताकि आप ऋण प्राप्त कर सकें। यह सरल और तेज़ होगा।",
    verification: {
      title: "सत्यापन चरण",
      steps: {
        aadhaar: "आधार सत्यापन",
        kyc: "KYC सत्यापन",
        bank: "बैंक खाता लिंकिंग",
        income: "आय प्रमाण अपलोड",
      },
      status: {
        notStarted: "शुरू नहीं हुआ",
        inProgress: "चल रहा है",
        completed: "पूरा हुआ",
      },
      progress: "चरण {n} में से 4",
      stepUnlocked: "अब हम आपका {step} सत्यापित करेंगे। जारी रखने के लिए बटन दबाएं।",
    },
  },
  {
    code: "ta-IN",
    name: "Tamil",
    nativeName: "தமிழ்",
    icon: "🪷",
    greeting: "வணக்கம்! வரவேற்கிறோம்.",
    welcomeMessage: "வரவேற்கிறோம்! கடன் பெற உங்கள் சரிபார்ப்பை முடிப்போம். இது எளிமையாகவும் விரைவாகவும் இருக்கும்.",
    verification: {
      title: "சரிபார்ப்பு படிகள்",
      steps: {
        aadhaar: "ஆதார் சரிபார்ப்பு",
        kyc: "KYC சரிபார்ப்பு",
        bank: "வங்கி கணக்கு இணைப்பு",
        income: "வருமான ஆவண பதிவேற்றம்",
      },
      status: {
        notStarted: "தொடங்கவில்லை",
        inProgress: "நடைபெறுகிறது",
        completed: "முடிந்தது",
      },
      progress: "படி {n} / 4",
      stepUnlocked: "இப்போது உங்கள் {step} சரிபார்ப்போம். தொடர பொத்தானை அழுத்தவும்.",
    },
  },
  {
    code: "te-IN",
    name: "Telugu",
    nativeName: "తెలుగు",
    icon: "🌺",
    greeting: "నమస్తే! స్వాగతం.",
    welcomeMessage: "స్వాగతం! రుణం పొందడానికి మీ ధృవీకరణను పూర్తి చేద్దాం. ఇది సరళంగా మరియు వేగంగా ఉంటుంది.",
    verification: {
      title: "ధృవీకరణ దశలు",
      steps: {
        aadhaar: "ఆధార్ ధృవీకరణ",
        kyc: "KYC ధృవీకరణ",
        bank: "బ్యాంక్ ఖాతా లింకింగ్",
        income: "ఆదాయ ప్రూఫ్ అప్లోడ్",
      },
      status: {
        notStarted: "ప్రారంభించలేదు",
        inProgress: "జరుగుతోంది",
        completed: "పూర్తయింది",
      },
      progress: "దశ {n} / 4",
      stepUnlocked: "ఇప్పుడు మీ {step} ధృవీకరిద్దాం. కొనసాగించడానికి బటన్ నొక్కండి.",
    },
  },
  {
    code: "kn-IN",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    icon: "🛡️",
    greeting: "ನಮಸ್ಕಾರ! ಸ್ವಾಗತ.",
    welcomeMessage: "ಸ್ವಾಗತ! ಸಾಲ ಪಡೆಯಲು ನಿಮ್ಮ ಪರಿಶೀಲನೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸೋಣ. ಇದು ಸರಳವಾಗಿ ಮತ್ತು ವೇಗವಾಗಿರುತ್ತದೆ.",
    verification: {
      title: "ಪರಿಶೀಲನಾ ಹಂತಗಳು",
      steps: {
        aadhaar: "ಆಧಾರ್ ಪರಿಶೀಲನೆ",
        kyc: "KYC ಪರಿಶೀಲನೆ",
        bank: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಲಿಂಕಿಂಗ್",
        income: "ಆದಾಯ ಪುರಾವೆ ಅಪ್ಲೋಡ್",
      },
      status: {
        notStarted: "ಪ್ರಾರಂಭಿಸಲಾಗಿಲ್ಲ",
        inProgress: "ನಡೆಯುತ್ತಿದೆ",
        completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      },
      progress: "ಹಂತ {n} / 4",
      stepUnlocked: "ಈಗ ನಿಮ್ಮ {step} ಪರಿಶೀಲಿಸೋಣ. ಮುಂದುವರಿಯಲು ಬಟನ್ ಒತ್ತಿ.",
    },
  },
  {
    code: "bn-IN",
    name: "Bengali",
    nativeName: "বাংলা",
    icon: "🪷",
    greeting: "নমস্কার! স্বাগতম.",
    welcomeMessage: "স্বাগতম! ঋণ পেতে আপনার যাচাই সম্পূর্ণ করি। এটি সহজ এবং দ্রুত হবে।",
    verification: {
      title: "যাচাইকরণ ধাপ",
      steps: {
        aadhaar: "আধার যাচাই",
        kyc: "KYC যাচাই",
        bank: "ব্যাংক অ্যাকাউন্ট লিঙ্কিং",
        income: "আয় প্রমাণ আপলোড",
      },
      status: {
        notStarted: "শুরু হয়নি",
        inProgress: "চলছে",
        completed: "সম্পন্ন",
      },
      progress: "ধাপ {n} / 4",
      stepUnlocked: "এখন আপনার {step} যাচাই করি। চালিয়ে যেতে বোতাম ট্যাপ করুন।",
    },
  },
];

export function getLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
