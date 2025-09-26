import { type Locale } from "@/contexts/LanguageContext";

// Import quiz question translations
import riasecEn from "@/locales/quiz-questions/riasec-en.json";
import riasecHi from "@/locales/quiz-questions/riasec-hi.json";
import riasecKs from "@/locales/quiz-questions/riasec-ks.json";

import domainEn from "@/locales/quiz-questions/domain-en.json";
import domainHi from "@/locales/quiz-questions/domain-hi.json";
import domainKs from "@/locales/quiz-questions/domain-ks.json";

import domain1112En from "@/locales/quiz-questions/domain-1112-en.json";
import domain1112Hi from "@/locales/quiz-questions/domain-1112-hi.json";
import domain1112Ks from "@/locales/quiz-questions/domain-1112-ks.json";

type QuizTranslations = {
  riasec: Record<Locale, Record<string, string>>;
  domain: Record<Locale, Record<string, any>>;
  "domain-1112": Record<Locale, Record<string, any>>;
};

const quizTranslations: QuizTranslations = {
  riasec: {
    en: riasecEn,
    hi: riasecHi,
    ks: riasecKs,
  },
  domain: {
    en: domainEn as any,
    hi: domainHi as any,
    ks: domainKs as any,
  },
  "domain-1112": {
    en: domain1112En as any,
    hi: domain1112Hi as any,
    ks: domain1112Ks as any,
  },
};

export function getQuizTranslation(
  quizType: "riasec" | "domain" | "domain-1112",
  locale: Locale,
  key: string,
): string {
  const translations = quizTranslations[quizType][locale];

  // Handle nested keys like "answers.mathematics"
  if (key.includes(".")) {
    const [parent, child] = key.split(".");
    if (parent && child) {
      const parentObj = translations[parent];
      if (parentObj && typeof parentObj === "object") {
        return (parentObj as any)[child] || key;
      }
    }
  }

  const translation = translations[key];
  // Fallback to English if translation not found
  return translation || quizTranslations[quizType]["en"][key] || key;
}

// Scale labels translations
export function getScaleLabel(locale: Locale, labelKey: string): string {
  const scaleTranslations: Record<Locale, Record<string, string>> = {
    en: {
      "Strongly disagree": "Strongly disagree",
      Neutral: "Neutral",
      "Strongly agree": "Strongly agree",
      "Not at all interested": "Not at all interested",
      "Somewhat interested": "Somewhat interested",
      "Very interested": "Very interested",
    },
    hi: {
      "Strongly disagree": "दृढ़ता से असहमत",
      Neutral: "तटस्थ",
      "Strongly agree": "दृढ़ता से सहमत",
      "Not at all interested": "बिल्कुल रुचि नहीं",
      "Somewhat interested": "कुछ रुचि है",
      "Very interested": "बहुत रुचि है",
    },
    ks: {
      "Strongly disagree": "سخت اختلاف",
      Neutral: "غیر جانبدار",
      "Strongly agree": "سخت اتفاق",
      "Not at all interested": "بالکل دلچسپی نہیں",
      "Somewhat interested": "کج دلچسپی چھُ",
      "Very interested": "زیادہ دلچسپی چھُ",
    },
  };

  return scaleTranslations[locale]?.[labelKey] || labelKey;
}
