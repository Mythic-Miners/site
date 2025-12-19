'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { createContext, useContext, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

import { detectPreferredLanguage } from '@/lib/i18n-client';
// Import translations
import enTranslations from '@/locales/en.json';
import ptTranslations from '@/locales/pt.json';

function ensureI18nInitialized() {
  // Next.js may evaluate this module during SSR even though it's a client component.
  // Guard any browser-only initialization to prevent crashes (e.g. localStorage access).
  if (typeof window === 'undefined') return;
  if (i18n.isInitialized) return;

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslations,
        },
        pt: {
          translation: ptTranslations,
        },
      },
      fallbackLng: 'en',
      detection: {
        // Avoid localStorage/sessionStorage during detection (can break in some runtimes)
        order: ['path', 'cookie', 'navigator'],
        caches: ['cookie'],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  ensureI18nInitialized();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const preferredLanguage = detectPreferredLanguage();
    setLanguage(preferredLanguage);
    i18n.changeLanguage(preferredLanguage);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
