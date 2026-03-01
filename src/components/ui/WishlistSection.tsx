'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/LanguageContext';

export default function WishlistSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section className="bg-[#3f3033] pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mt-20 mb-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]">
          <p className="text-stone-300 text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
            {t('landing.wishlist.announcement')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-100 mythic-text-shadow">
            {t('landing.wishlist.title')}
          </h2>
          <p className="text-lg text-stone-200 max-w-2xl mx-auto mb-4">
            Thanks to everyone who has played the game in Web3 until now. We are
            migrating to Steam.
          </p>
          <p className="text-lg text-stone-200 max-w-2xl mx-auto mb-8">
            {t('landing.wishlist.description')}
          </p>
          <Link
            href={`/${language}/wishlist`}
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex items-center justify-center rounded-md bg-gray-600 text-gray-400 cursor-not-allowed pointer-events-none px-6 py-3 text-base font-semibold border-2 border-gray-500"
          >
            {t('landing.wishlist.link')}
          </Link>
        </div>
      </div>
    </section>
  );
}
