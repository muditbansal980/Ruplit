"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Globe } from "lucide-react";
import ProtectedRoute from "@/routes/ProtectedRoute";

function SettingsContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, role } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
  };

  const getBackPath = () => {
    if (role === "ADMIN") return "/admin";
    if (role === "TEAM") return "/team";
    return "/dashboard";
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(getBackPath())}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">{t("settings.title")}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile")}</CardTitle>
            <CardDescription>{t("settings.profileDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{user?.name || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="secondary">{user?.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("settings.language")}
            </CardTitle>
            <CardDescription>{t("settings.languageDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{lang.nativeTitle}</p>
                      <p className="text-sm text-muted-foreground">{lang.name}</p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
