'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/LanguageContext';

import Header from '@/components/ui/Header';

export default function WishlistPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="bg-[#3f3033] min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-100 mythic-text-shadow mb-4">
          {t('landing.wishlist.title')}
        </h1>
        <p className="text-xl text-stone-200 mb-8">
          {t('landing.wishlist.comingSoon')}
        </p>
        <Link
          href={`/${language}`}
          className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
        >
          {t('common.back')}
        </Link>
      </div>
    </div>
  );
}
