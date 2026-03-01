'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/LanguageContext';

import Header from '@/components/ui/Header';
import LandingPlayersSection from '@/components/ui/LandingPlayersSection';
import WalkingCharacter from '@/components/ui/WalkingMiner';
import WishlistSection from '@/components/ui/WishlistSection';

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="bg-[#3f3033]">
      <section className="bg-[url('/assets/images/background.png')] bg-cover bg-left h-[80vh] w-full relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 pt-[200px] md:py-14 flex flex-col items-center opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          <h1 className="text-yellow-50 mt-20 ml-4 mythic-text-shadow text-4xl md:text-6xl font-bold mb-4 font-ceaser">
            {t('hero.title')}
          </h1>
        </section>
        <div className="absolute bottom-[5px] left-0 right-0">
          <WalkingCharacter />
          <div className="bg-[url('/assets/images/ground.png')] bg-left bg-size-[70px] h-[71px] w-full absolute "></div>
        </div>
      </section>

      <WishlistSection />

      <LandingPlayersSection />

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6 md:px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center ">
                <Image
                  src="/assets/images/logo.webp"
                  alt="Mythic Miners"
                  width={40}
                  height={40}
                />
                <h2 className="text-2xl font-bold text-yellow-50 font-ceaser ml-2 mythic-text-shadow">
                  Mythic Miners
                </h2>
              </div>
              <p className="text-gray-400 mt-4 max-w-xs">
                {t('footer.description')}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('footer.quickLinks.title')}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://whitepaper.mythicminers.com/"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.quickLinks.whitepaper')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://mythicminers.com/"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.quickLinks.game')}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('footer.legal.title')}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href={`/${language}/terms-of-use`}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.legal.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${language}/privacy-policy`}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.legal.privacy')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
