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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { MessageCircle, Phone } from "lucide-react";

const signupSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long"),
  email: z.string().email("Please enter a valid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { loginAsUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const result = await authApi.signup(data.mobileNumber, data.email);
      loginAsUser(
        {
          id: result.user.id,
          role: "USER",
          mobileNumber: result.user.mobileNumber,
          email: result.user.email || undefined,
        },
        result.token
      );
      toast.success(t("auth.welcome"));
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.signup")}</CardTitle>
          <CardDescription>{t("auth.newUser")}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentLanguage?.signupHelper && (
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">{t("auth.mobileNumber")}</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="+91 9999999999"
                {...register("mobileNumber")}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
