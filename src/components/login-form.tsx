"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { useTranslation } from "@/contexts/LanguageContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-fuchsia-300/10 via-white/10 to-white/10 dark:from-fuchsia-400/10 backdrop-blur-2xl ring-1 ring-white/10 shadow-xl">
        {/* Lavender tint overlay (non-blocking) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-300/10 via-transparent to-transparent dark:from-fuchsia-400/10" />
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("form.password")}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.login.loggingIn") : t("button.login")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.login.dontHaveAccount")}{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                {t("auth.login.signUpLink")}
              </Link>
            </div>
          </form>
          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="text-muted-foreground mx-4 text-sm">
              {t("auth.login.or")}
            </span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSocialLogin}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-destructive-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("auth.login.loggingIn")
                  : t("auth.login.continueWithGoogle")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
