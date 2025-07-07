'use client';

import type { SupportedLanguage } from './i18n-server';
import { supportedLanguages } from './i18n-server';

// Client-side language detection using navigator
export function detectLanguageFromNavigator(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'en'; // Default fallback for SSR
  }

  // Get languages from navigator (modern browsers)
  const navigatorLanguages = navigator.languages || [navigator.language];

  // Find the first supported language
  for (const language of navigatorLanguages) {
    const normalizedLang = language.toLowerCase();

    // Check exact match first
    if (supportedLanguages.includes(normalizedLang as SupportedLanguage)) {
      return normalizedLang;
    }

    // Check language prefix (e.g., 'en-US' -> 'en')
    const langPrefix = normalizedLang.split('-')[0];
    if (supportedLanguages.includes(langPrefix as SupportedLanguage)) {
      return langPrefix;
    }
  }

  // Default to English if no supported language is found
  return 'en';
}

// Get language from URL path
function getLanguageFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    const langFromUrl = pathSegments[0];
    if (supportedLanguages.includes(langFromUrl as SupportedLanguage)) {
      return langFromUrl;
    }
  }

  return null;
}

// Get language from cookies
function getLanguageFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const languageCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('preferred-language='),
  );

  if (languageCookie) {
    const language = languageCookie.split('=')[1];
    if (supportedLanguages.includes(language as SupportedLanguage)) {
      return language;
    }
  }

  return null;
}

// Simple language detection: URL -> cookies -> navigator -> fallback
export function detectPreferredLanguage(): string {
  // First try to get from URL
  const urlLanguage = getLanguageFromUrl();
  if (urlLanguage) {
    return urlLanguage;
  }

  // Then try cookies (set by middleware)
  const cookieLanguage = getLanguageFromCookie();
  if (cookieLanguage) {
    return cookieLanguage;
  }

  // Then try navigator
  return detectLanguageFromNavigator();
}
