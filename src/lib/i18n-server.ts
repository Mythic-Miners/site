import enTranslations from '@/locales/en.json';
import ptTranslations from '@/locales/pt.json';
import type { InterpolationParams, TranslationPath } from '@/types/i18n';

// Define supported languages
export const supportedLanguages = ['en', 'pt'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// Translation resources
const translations = {
  en: enTranslations,
  pt: ptTranslations,
} as const;

// Get translations for a specific language
export function getTranslations(lang: string): typeof enTranslations {
  // Validate language and fallback to English
  const validLang = supportedLanguages.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : 'en';

  return translations[validLang];
}

// Get a specific translation by key path
export function getTranslation(
  lang: string,
  keyPath: TranslationPath,
  params?: InterpolationParams,
): string {
  const translations = getTranslations(lang);

  // Navigate through nested keys (e.g., 'common.welcome')
  const keys = keyPath.split('.');
  let value: any = translations;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      return keyPath; // Return the key if translation not found
    }
  }

  // Handle interpolation if params are provided
  if (params && typeof value === 'string') {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  return typeof value === 'string' ? value : keyPath;
}

// Generate static params for Next.js
export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({
    lang,
  }));
}

// Enhanced server-side language detection with better fallback logic
export function detectLanguageFromHeaders(
  acceptLanguageHeader: string,
): string {
  if (!acceptLanguageHeader) {
    return 'en'; // Default fallback
  }

  // Parse accept-language header with quality values
  const preferredLanguages = acceptLanguageHeader
    .split(',')
    .map((lang) => {
      const [language, ...qualityParts] = lang.split(';');
      const quality =
        qualityParts.length > 0
          ? parseFloat(qualityParts[0].split('=')[1]) || 1.0
          : 1.0;

      return {
        language: language.trim().toLowerCase(),
        quality,
      };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality (preference)

  // Find the first supported language
  for (const { language } of preferredLanguages) {
    // Check exact match first
    if (supportedLanguages.includes(language as SupportedLanguage)) {
      return language;
    }

    // Check language prefix (e.g., 'en-US' -> 'en')
    const langPrefix = language.split('-')[0];
    if (supportedLanguages.includes(langPrefix as SupportedLanguage)) {
      return langPrefix;
    }
  }

  // Default to English if no supported language is found
  return 'en';
}
