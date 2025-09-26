// Utility functions for working with Supabase multilingual data

import type { Locale } from "@/contexts/LanguageContext";

/**
 * Generic type for multilingual database records
 * T represents the base field names (without language suffixes)
 */
export type MultilingualRecord<T extends string> = {
  [K in T as `${K}_en`]: string;
} & {
  [K in T as `${K}_hi`]?: string;
} & {
  [K in T as `${K}_ks`]?: string;
};

/**
 * Get localized content from a multilingual record with fallback to English
 */
export function getLocalizedField<T extends string>(
  record: MultilingualRecord<T>,
  fieldName: T,
  locale: Locale,
): string {
  // Try to get the localized version
  const localizedKey = `${fieldName}_${locale}` as keyof MultilingualRecord<T>;
  const localizedValue = record[localizedKey];

  if (
    localizedValue &&
    typeof localizedValue === "string" &&
    localizedValue.trim()
  ) {
    return localizedValue;
  }

  // Fallback to English
  const englishKey = `${fieldName}_en` as keyof MultilingualRecord<T>;
  const englishValue = record[englishKey];

  return (typeof englishValue === "string" ? englishValue : "") || "";
}

/**
 * Transform a multilingual record to have localized fields based on current locale
 * This is useful for components that expect simple field names
 */
export function localizeRecord<T extends string>(
  record: MultilingualRecord<T> & Record<string, any>,
  fieldNames: T[],
  locale: Locale,
): Record<T, string> & Record<string, any> {
  const localized = { ...record };

  fieldNames.forEach((fieldName) => {
    localized[fieldName as keyof typeof localized] = getLocalizedField(
      record,
      fieldName,
      locale,
    );
  });

  return localized as Record<T, string> & Record<string, any>;
}

/**
 * Generate Supabase select query for multilingual fields
 */
export function getMultilingualSelect(
  baseFields: string[],
  otherFields: string[] = [],
): string {
  const multilingualFields = baseFields.flatMap((field) => [
    `${field}_en`,
    `${field}_hi`,
    `${field}_ks`,
  ]);

  return [...multilingualFields, ...otherFields].join(", ");
}

/**
 * Create an update object for multilingual content
 */
export function createMultilingualUpdate<T extends string>(
  fieldName: T,
  translations: {
    en: string;
    hi?: string;
    ks?: string;
  },
): Partial<MultilingualRecord<T>> {
  const update: any = {};

  update[`${fieldName}_en`] = translations.en;
  if (translations.hi) update[`${fieldName}_hi`] = translations.hi;
  if (translations.ks) update[`${fieldName}_ks`] = translations.ks;

  return update;
}

/**
 * Validate that required English content exists for a multilingual record
 */
export function validateMultilingualRecord<T extends string>(
  record: Partial<MultilingualRecord<T>>,
  requiredFields: T[],
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    const englishKey = `${field}_en` as keyof MultilingualRecord<T>;
    const englishValue = record[englishKey];

    if (
      !englishValue ||
      (typeof englishValue === "string" && !englishValue.trim())
    ) {
      missingFields.push(englishKey as string);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Example SQL for creating multilingual tables
export const multilingualTableSQL = {
  products: `
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

      -- English content (required)
      name_en TEXT NOT NULL,
      description_en TEXT NOT NULL,
      short_description_en TEXT,

      -- Hindi content (optional)
      name_hi TEXT,
      description_hi TEXT,
      short_description_hi TEXT,

      -- Kashmiri content (optional)
      name_ks TEXT,
      description_ks TEXT,
      short_description_ks TEXT,

      -- Non-translatable fields
      price DECIMAL(10,2),
      image_url TEXT,
      category_id UUID,
      is_active BOOLEAN DEFAULT true,

      CONSTRAINT products_name_en_not_empty CHECK (length(name_en) > 0),
      CONSTRAINT products_description_en_not_empty CHECK (length(description_en) > 0)
    );
  `,

  jobListings: `
    CREATE TABLE job_listings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

      -- English content (required)
      title_en TEXT NOT NULL,
      description_en TEXT NOT NULL,
      requirements_en TEXT,
      benefits_en TEXT,

      -- Hindi content (optional)
      title_hi TEXT,
      description_hi TEXT,
      requirements_hi TEXT,
      benefits_hi TEXT,

      -- Kashmiri content (optional)
      title_ks TEXT,
      description_ks TEXT,
      requirements_ks TEXT,
      benefits_ks TEXT,

      -- Non-translatable fields
      company_name TEXT NOT NULL,
      company_id UUID,
      location TEXT NOT NULL,
      salary_min INTEGER,
      salary_max INTEGER,
      employment_type TEXT NOT NULL DEFAULT 'full-time',
      remote_allowed BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,

      CONSTRAINT job_listings_title_en_not_empty CHECK (length(title_en) > 0),
      CONSTRAINT job_listings_description_en_not_empty CHECK (length(description_en) > 0)
    );
  `,

  articles: `
    CREATE TABLE articles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

      -- English content (required)
      title_en TEXT NOT NULL,
      content_en TEXT NOT NULL,
      excerpt_en TEXT,

      -- Hindi content (optional)
      title_hi TEXT,
      content_hi TEXT,
      excerpt_hi TEXT,

      -- Kashmiri content (optional)
      title_ks TEXT,
      content_ks TEXT,
      excerpt_ks TEXT,

      -- Non-translatable fields
      author_id UUID NOT NULL,
      featured_image_url TEXT,
      category TEXT,
      tags TEXT[],
      published BOOLEAN DEFAULT false,
      published_at TIMESTAMP WITH TIME ZONE,

      CONSTRAINT articles_title_en_not_empty CHECK (length(title_en) > 0),
      CONSTRAINT articles_content_en_not_empty CHECK (length(content_en) > 0)
    );
  `,
};
