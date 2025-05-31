'use client';

import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="text-black px-1 py-1 text-md border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="en">🇺🇸</option>
      <option value="pt">🇧🇷</option>
    </select>
  );
}
