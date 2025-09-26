"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, type Locale } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PillNav from "@/components/PillNav";
import logo from "@/../public/sahay.svg";

// Custom CSS for additional animations
const customStyles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
`;

const Header = () => {
  const pathname = usePathname();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Enhanced error boundary for translation context
  let translationContext;
  try {
    translationContext = useTranslation();
  } catch (error) {
    console.error("Translation context not available:", error);
    translationContext = {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => key,
      languageMetadata: {
        en: { name: "English", nativeName: "English", flag: "🇺🇸", rtl: false },
        es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
        fr: { name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
        de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
        it: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹", rtl: false },
      },
      isRTL: false,
    };
  }

  const { locale, setLocale, t, languageMetadata, isRTL } = translationContext;

  // Navigation items with longer labels for better pill appearance
  const navigationItems = [
    {
      label: t("header.navigation.dashboard") || "Dashboard",
      href: "/dashboard",
    },
    {
      label: t("header.navigation.jobs") || "Job Opportunities",
      href: "/jobs",
    },
    {
      label: t("header.navigation.certifications") || "Certifications",
      href: "/certifications",
    },
    { label: t("header.navigation.profile") || "My Profile", href: "/profile" },
    { label: t("header.navigation.chat") || "Chat", href: "/chat" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for language menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsLanguageMenuOpen(false);
  };

  return (
    <>
      {/* Inject custom styles */}
      <style jsx global>
        {customStyles}
      </style>

      {/* Minimal Top Bar with Logo and Language Settings */}
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "border-b border-white/20 bg-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/25"
            : "border-b border-white/10 bg-white/15 ring-1 ring-white/10 backdrop-blur-2xl dark:border-white/5 dark:bg-black/15"
        } `}
      >
        {/* Gentle fog overlay allowing Iridescence to shine through */}
        <div className="pointer-events-none absolute inset-0">
          {/* Lavender tint (lighter than footer for subtle distinction) */}
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-300/10 via-transparent to-transparent dark:from-fuchsia-400/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-black/10" />
        </div>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex h-14 items-center justify-between">
            {/* Spacer */}
            <div className="flex-1" />

            {/* Language Switcher */}
            <div className="relative" ref={languageMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className={`flex items-center space-x-2 rounded-xl border border-transparent px-4 py-2 text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-gray-200/50 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:border-gray-700/50 dark:hover:bg-gray-800/80 ${isLanguageMenuOpen ? "border-gray-200/50 bg-gray-100/80 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/80" : ""} `}
              >
                <span className="text-lg">
                  {languageMetadata[locale]?.flag || "🇺🇸"}
                </span>
                <span className="hidden text-sm font-medium sm:inline">
                  {languageMetadata[locale]?.nativeName || "English"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isLanguageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Language Dropdown */}
              {isLanguageMenuOpen && (
                <div
                  className={`absolute ${isRTL ? "left-0" : "right-0"} animate-in slide-in-from-top-3 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/98 shadow-2xl backdrop-blur-2xl duration-300 ease-out dark:border-gray-700/60 dark:bg-gray-900/98`}
                >
                  <div className="py-3">
                    {Object.entries(languageMetadata).map(([code, meta]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code as Locale)}
                        className={`flex w-full items-center space-x-4 px-5 py-3 text-left transition-all duration-200 ${
                          locale === code
                            ? "bg-gray-900 text-white shadow-sm dark:bg-white dark:text-black"
                            : "text-gray-700 hover:bg-gray-50/80 dark:text-gray-300 dark:hover:bg-gray-800/80"
                        } `}
                      >
                        <span className="text-xl">{meta.flag}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {meta.nativeName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {meta.name}
                          </span>
                        </div>
                        {locale === code && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Pill Navigation */}
      <div
        className={`animate-float fixed top-16 left-1/2 z-40 -translate-x-1/2 transform transition-all duration-700 ease-out ${
          isScrolled
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-1 scale-[0.98] opacity-95"
        } `}
      >
        <PillNav
          logo={logo}
          logoAlt="Sahay Logo"
          items={navigationItems}
          activeHref={pathname || "/dashboard"}
          className={`shadow-2xl transition-all duration-700 ease-out ${
            isScrolled
              ? "border border-white/20 bg-white/25 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/25"
              : "border border-white/10 bg-white/15 shadow-xl ring-1 ring-white/10 backdrop-blur-2xl dark:border-white/5 dark:bg-black/15"
          } rounded-full px-3 py-2.5 hover:scale-[1.03] hover:bg-white/25 hover:shadow-2xl dark:hover:bg-black/25`}
          ease="power4.easeInOut"
          trackColor="transparent"
          pillColor={isScrolled ? "#111827" : "#1f2937"}
          hoveredPillTextColor="#ffffff"
          pillTextColor="#ffffff"
          initialLoadAnimation={true}
        />
      </div>
    </>
  );
};

export default Header;
