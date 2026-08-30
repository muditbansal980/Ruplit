"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import {
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

// ── Step 1 schema: email + phone ──────────────────────────────
const detailsSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long")
    .regex(/^\+?\d+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

// ── Step 2 schema: OTP code ───────────────────────────────────
const otpSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { loginAsUser } = useAuth();
  const { currentLanguage } = useLanguage();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // ── Step 1: Send OTP ──────────────────────────────────────
  const detailsForm = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
  });

  const handleSendOtp = async (data: DetailsFormData) => {
    setIsLoading(true);
    try {
      setEmail(data.email);
      setMobileNumber(data.mobileNumber);
      await authApi.sendOtp(data.email, "signup");
      toast.success(t("auth.otpSent"));
      setStep(2);
      startOtpTimer();
    } catch (error: any) {
      const msg =
        error.response?.data?.error || error.message || t("auth.otpError");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP + Signup ───────────────────────────
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      // 1. Verify OTP
      await authApi.verifyOtp(email, data.code, "signup");

      // 2. Complete signup (find-or-create user)
      const result = await authApi.signup(mobileNumber, email);
      loginAsUser(
        {
          id: result.user.id,
          role: "USER",
          mobileNumber: result.user.mobileNumber,
          email: result.user.email || undefined,
        },
        result.token
      );

      toast.success(t("auth.otpVerified"));

      // 3. Store auth cookie for server-side reading
      document.cookie = `banksahayak-auth=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      router.push("/dashboard");
    } catch (error: any) {
      const msg =
        error.response?.data?.error || error.message || t("auth.otpInvalid");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Resend Timer ──────────────────────────────────────
  const startOtpTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    try {
      await authApi.sendOtp(email, "signup");
      toast.success(t("auth.otpSent"));
      startOtpTimer();
    } catch (error: any) {
      toast.error(error.response?.data?.error || t("auth.otpError"));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* Step indicator */}
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
            </div>
            <div
              className={`h-0.5 flex-1 ${
                step >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>

          <CardTitle>
            {step === 1 ? t("auth.signup") : t("auth.otpTitle")}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? t("auth.newUser")
              : t("auth.otpSentTo", { email })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ── Helper Message ──────────────────────────────── */}
          {step === 1 && currentLanguage?.signupHelper && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="flex-1 leading-relaxed">
                {currentLanguage.signupHelper}
              </p>
              <a
                href="tel:8800980470"
                className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Phone className="h-3.5 w-3.5" />
                8800980470
              </a>
            </div>
          )}

          {/* ── Step 1: Details Form ────────────────────────── */}
          {step === 1 && (
            <form
              onSubmit={detailsForm.handleSubmit(handleSendOtp)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...detailsForm.register("email")}
                />
                {detailsForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {detailsForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t("auth.mobileNumber")}
                </Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="+91 9999999999"
                  {...detailsForm.register("mobileNumber")}
                />
                {detailsForm.formState.errors.mobileNumber && (
                  <p className="text-sm text-red-500">
                    {detailsForm.formState.errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isLoading ? t("common.loading") : t("auth.sendOtp")}
              </Button>
            </form>
          )}

          {/* ── Step 2: OTP Verification ────────────────────── */}
          {step === 2 && (
            <>
              <form
                onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {t("auth.otpCode")}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t("auth.otpPlaceholder")}
                    className="text-center text-2xl tracking-[0.5em]"
                    {...otpForm.register("code")}
                  />
                  {otpForm.formState.errors.code && (
                    <p className="text-sm text-red-500">
                      {otpForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? t("common.loading") : t("auth.otpVerify")}
                </Button>
              </form>

              <div className="mt-4 flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={otpTimer > 0}
                  className="text-sm"
                >
                  {otpTimer > 0
                    ? t("auth.otpResendIn", { seconds: otpTimer.toString() })
                    : t("auth.otpResend")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  {t("common.back")}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
