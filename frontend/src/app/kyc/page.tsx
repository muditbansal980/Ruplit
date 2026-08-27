"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSubmitKyc, useUploadAadhar } from "@/hooks/useKyc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Phone, User } from "lucide-react";
import { toast } from "sonner";

export default function KycPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const submitKyc = useSubmitKyc();
  const uploadAadhar = useUploadAadhar();

  const [step, setStep] = useState<"choose" | "mobile" | "upload">("choose");
  const [mode, setMode] = useState<"ASSISTED" | "SELF" | null>(null);
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChooseMode = (selectedMode: "ASSISTED" | "SELF") => {
    setMode(selectedMode);
    if (isAuthenticated && user?.mobileNumber) {
      // Logged in — skip mobile step
      setStep("upload");
    } else {
      // Guest — need mobile number
      setStep("mobile");
    }
  };

  const handleMobileSubmit = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setStep("upload");
  };

  const handleSubmitRequest = async () => {
    if (!mode) return;

    try {
      const result = await submitKyc.mutateAsync({
        mode,
        mobileNumber: isAuthenticated ? undefined : mobileNumber,
      });
      setRequestId(result.id);

      if (selectedFile) {
        await uploadAadhar.mutateAsync({
          requestId: result.id,
          file: selectedFile,
        });
      }

      toast.success(t("kyc.requestSubmitted"));
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit");
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{t("kyc.title")}</h1>
        </div>

        {/* Step 1: Choose Mode */}
        {step === "choose" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              className="cursor-pointer transition hover:border-zinc-400 hover:shadow-md"
              onClick={() => handleChooseMode("ASSISTED")}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Phone className="h-6 w-6" />
                </div>
                <CardTitle>{t("kyc.hireAssistant")}</CardTitle>
                <CardDescription>{t("kyc.hireAssistantDesc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-zinc-400 hover:shadow-md"
              onClick={() => handleChooseMode("SELF")}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle>{t("kyc.doItYourself")}</CardTitle>
                <CardDescription>{t("kyc.doItYourselfDesc")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Step 2: Mobile Number (guest only) */}
        {step === "mobile" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("kyc.mobileHint")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("auth.mobileNumber")}</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <Button onClick={handleMobileSubmit} className="w-full">
                {t("common.next")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload Aadhar */}
        {step === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("kyc.uploadAadhar")}</CardTitle>
              <CardDescription>{t("kyc.uploadHint")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("kyc.uploadAadhar")}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              {selectedFile && (
                <p className="text-sm text-zinc-500">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}

              <Button
                onClick={handleSubmitRequest}
                className="w-full"
                disabled={!selectedFile || submitKyc.isPending || uploadAadhar.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                {submitKyc.isPending || uploadAadhar.isPending
                  ? t("common.loading")
                  : t("kyc.submit")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
