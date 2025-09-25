"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Import translation files
import enTranslations from "@/locales/en.json";
import hiTranslations from "@/locales/hi.json";
import ksTranslations from "@/locales/ks.json";

// Define supported locales
export type Locale = "en" | "hi" | "ks";

// Define the shape of our translations
type Translations = typeof enTranslations;

// Create a map of all translations
const translations: Record<Locale, Translations> = {
  en: enTranslations,
  hi: hiTranslations,
  ks: ksTranslations,
};

// Language metadata for display purposes
export const languageMetadata = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    rtl: false,
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    rtl: false,
  },
  ks: {
    name: "Kashmiri",
    nativeName: "کٲشُر",
    flag: "🏔️",
    rtl: true,
  },
} as const;

// Define the context type
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  languageMetadata: typeof languageMetadata;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Local storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = "sahay-language";

// Get nested property from object using dot notation
function getNestedProperty(obj: any, path: string): string {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

// Interpolate parameters in translation strings
function interpolateParams(
  str: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return str;

  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

// Get browser language preference
function getBrowserLanguage(): Locale {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language?.split("-")[0];
  return browserLang && ["en", "hi", "ks"].includes(browserLang)
    ? (browserLang as Locale)
    : "en";
} // Get saved language from localStorage or browser preference
function getSavedLanguage(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale;
    if (saved && ["en", "hi", "ks"].includes(saved)) {
      return saved;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }

  return getBrowserLanguage();
}

// LanguageProvider component
interface LanguageProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LanguageProvider({
  children,
  defaultLocale = "en",
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(
    typeof window === "undefined",
  );

  // Initialize language on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = getSavedLanguage();
      setLocaleState(savedLanguage);
      setIsInitialized(true);
    }
  }, []);

  // Update localStorage when locale changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error);
    }
  }, [locale, isInitialized]);

  // Set locale function with validation
  const setLocale = (newLocale: Locale) => {
    if (["en", "hi", "ks"].includes(newLocale)) {
      setLocaleState(newLocale);
    } else {
      console.warn(`Invalid locale: ${newLocale}. Using default locale.`);
      setLocaleState("en");
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const translation = getNestedProperty(translations[locale], key);

      if (translation === null || translation === undefined) {
        // Fallback to English if translation not found
        const fallback = getNestedProperty(translations.en, key);

        if (fallback === null || fallback === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key; // Return the key itself as last resort
        }

        return interpolateParams(fallback, params);
      }

      return interpolateParams(translation, params);
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return key;
    }
  };

  // Check if current language is RTL
  const isRTL = languageMetadata[locale]?.rtl || false;

  // Context value
  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    isRTL,
    languageMetadata,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useTranslation() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  return context;
}

// Export types for use in other files
export type { LanguageContextType, Translations };

// Utility function to get available locales
export const getAvailableLocales = (): Locale[] => ["en", "hi", "ks"];

// Utility function to check if a locale is supported
export const isSupportedLocale = (locale: string): locale is Locale => {
  return ["en", "hi", "ks"].includes(locale);
};
