'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="hover:bg-indigo-950/40 cursor-pointer text-black px-1 py-1 text-lg border-black rounded-md focus:outline-none"
    >
      <option value="en">🇺🇸</option>
      <option value="pt">🇧🇷</option>
    </select>
  );
}
