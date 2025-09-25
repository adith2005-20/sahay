"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, type Locale } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const pathname = usePathname();

  // Add error boundary for translation context
  let translationContext;
  try {
    translationContext = useTranslation();
  } catch (error) {
    console.error("Translation context not available:", error);
    // Provide fallback values
    translationContext = {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => key,
      languageMetadata: {
        en: { name: "English", nativeName: "English", flag: "🇺🇸", rtl: false },
      },
      isRTL: false,
    };
  }

  const { locale, setLocale, t, languageMetadata, isRTL } = translationContext;
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsLanguageMenuOpen(false);
  };

  return (
    <div className="dark:bg-background/40 bg-background sticky top-0 z-50 w-full flex-col justify-center pt-1 backdrop-blur-md">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4">
        <div className="flex-1" />
        <Link href={"/dashboard"}>
          <Image
            className="mx-auto justify-center"
            src={"/sahay.svg"}
            width={80}
            height={80}
            alt={t("header.title")}
          />
        </Link>

        {/* Language Switcher */}
        <div className="flex flex-1 justify-end">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-lg">
                {languageMetadata[locale]?.flag || "🇺🇸"}
              </span>
              <span className="hidden sm:inline">
                {languageMetadata[locale]?.nativeName || "English"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {isLanguageMenuOpen && (
              <div className="bg-background absolute right-0 z-10 mt-1 w-48 rounded-md border py-1 shadow-lg">
                {Object.entries(languageMetadata).map(([code, meta]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as Locale)}
                    className={`hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 px-4 py-2 text-left ${
                      locale === code ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <span className="text-lg">{meta.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{meta.nativeName}</span>
                      <span className="text-muted-foreground text-xs">
                        {meta.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`flex justify-center gap-6 py-2 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <Link
          href="/dashboard"
          className={`text-sm font-medium underline-offset-4 hover:underline ${pathname?.startsWith("/dashboard") ? "text-primary underline" : "text-muted-foreground"}`}
        >
          {t("header.navigation.dashboard")}
        </Link>
        <Link
          href="/jobs"
          className={`text-sm font-medium underline-offset-4 hover:underline ${pathname?.startsWith("/jobs") ? "text-primary underline" : "text-muted-foreground"}`}
        >
          {t("header.navigation.jobs")}
        </Link>
        <Link
          href="/certifications"
          className={`text-sm font-medium underline-offset-4 hover:underline ${pathname?.startsWith("/certifications") ? "text-primary underline" : "text-muted-foreground"}`}
        >
          {t("header.navigation.certifications")}
        </Link>
        <Link
          href="/profile"
          className={`text-sm font-medium underline-offset-4 hover:underline ${pathname?.startsWith("/profile") ? "text-primary underline" : "text-muted-foreground"}`}
        >
          {t("header.navigation.profile")}
        </Link>
      </nav>
      <Separator className="mt-1" />

      {/* Click outside handler */}
      {isLanguageMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsLanguageMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;
