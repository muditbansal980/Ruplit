"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/useLanguage";
import { useSpeak } from "@/hooks/useSpeak";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GreetingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, currentLanguage } = useLanguage();
  const { speak } = useSpeak();
  const { isAuthenticated, role } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (role === "ADMIN") router.replace("/admin");
      else if (role === "TEAM") router.replace("/team");
      else router.replace("/dashboard");
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    // Speak the greeting when the page loads
    if (currentLanguage) {
      speak(currentLanguage.greeting, currentLanguage.code);
    }
  }, [currentLanguage, speak]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg md:text-8xl" >
          {currentLanguage?.greeting || "Hello"}
         </h1> 

         <p className="text-xl text-white/80 md:text-2xl">
          {t("greeting.welcome")}
        </p> 

        <p className="text-lg text-white/60">{t("greeting.subtitle")}</p>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-white/50"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => router.push("/signup")}
          className="mt-8 px-8 py-6 text-lg"
        >
          {t("greeting.continue")}
        </Button>
      </div>
    </main>
  );
}
