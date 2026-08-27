"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Landmark,
  Phone,
  Wallet,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import ProtectedRoute from "@/routes/ProtectedRoute";

function DashboardContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const features = [
    {
      id: "expenses",
      title: t("dashboard.expenseRecord"),
      description: t("dashboard.expenseDesc"),
      icon: Receipt,
      enabled: true,
      href: "/dashboard/expenses",
    },
    {
      id: "loan",
      title: t("dashboard.loan"),
      description: t("dashboard.loanDesc"),
      icon: Landmark,
      enabled: false,
      href: "#",
    },
    {
      id: "contact",
      title: t("dashboard.contactBank"),
      description: t("dashboard.contactDesc"),
      icon: Phone,
      enabled: false,
      href: "#",
    },
    {
      id: "wallet",
      title: t("dashboard.wallet"),
      description: t("dashboard.walletDesc"),
      icon: Wallet,
      enabled: false,
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-zinc-500">
              {user?.mobileNumber || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition ${
                feature.enabled
                  ? "hover:border-zinc-400 hover:shadow-md"
                  : "pointer-events-none opacity-60"
              }`}
              onClick={() => feature.enabled && router.push(feature.href)}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                {!feature.enabled && (
                  <Badge variant="secondary">{t("dashboard.comingSoon")}</Badge>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* KYC Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/kyc")}
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            {t("dashboard.kyc")}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <DashboardContent />
    </ProtectedRoute>
  );
}
