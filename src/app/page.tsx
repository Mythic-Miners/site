'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import Header from '@/components/ui/Header';
import SocialProofSection from '@/components/ui/SocialProofSection';
import TokenPurchaseSection from '@/components/ui/TokenPurchaseSection';
import WalkingCharacter from '@/components/ui/WalkingMiner';

//
export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#3f3033]">
      <section className="bg-[url('/assets/images/background.png')] bg-cover bg-left h-[80vh] w-full relative">
        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-14 flex flex-col items-center  opacity-0  animate-[fadeIn_0.8s_ease-out_forwards]">
          <h1 className="text-yellow-50 ml-4 mythic-text-shadow text-4xl md:text-6xl font-bold mb-4 font-ceaser">
            {t('hero.title')}
          </h1>
          <p className="hidden sm:block text-xl mt-2 mb-12 text-gray-900 text-center max-w-[700px]">
            {t('hero.description.desktop')}
          </p>
          <p className="sm:hidden block text-xl mt-2 mb-12 text-gray-900 text-center max-w-[700px]">
            {t('hero.description.mobile')}
          </p>
        </section>
        <div className="absolute bottom-[5px] left-0 right-0">
          <WalkingCharacter />
          <div className="bg-[url('/assets/images/ground.png')] bg-left bg-size-[70px] h-[71px] w-full absolute "></div>
        </div>
      </section>

      <TokenPurchaseSection />

      {/* Social Proof Section */}
      <SocialProofSection />

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
                <h1 className="text-2xl font-bold text-yellow-50 font-ceaser ml-2 mythic-text-shadow">
                  Mythic Miners
                </h1>
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
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.quickLinks.whitepaper')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.quickLinks.icoDocument')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.quickLinks.game')}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('footer.legal.title')}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.legal.terms')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {t('footer.legal.privacy')}
                    </a>
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
