'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

import AuthButton from './AuthButton';

export default function LandingPlayersSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isConnected } = useAuth();

  return (
    <section className="bg-gray-800/50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-100 mythic-text-shadow">
            {t('landing.players.title')}
          </h2>
          <p className="text-lg text-stone-200 max-w-2xl mx-auto mb-8">
            {t('landing.players.description')}
          </p>
          <div className="max-w-sm mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AuthButton />
            {isConnected && (
              <>
                <Button
                  as={Link}
                  href={`/${language}/inventory`}
                  className="bg-linear-to-r from-cyan-500 to-cyan-400 min-h-[48px] border-2 border-neutral-950 font-bold text-black hover:from-cyan-600 hover:to-cyan-500"
                >
                  {t('landing.players.inventory')}
                </Button>
                <Button
                  as={Link}
                  href={`/${language}/leaderboard`}
                  className="bg-linear-to-r from-cyan-500 to-cyan-400 min-h-[48px] border-2 border-neutral-950 font-bold text-black hover:from-cyan-600 hover:to-cyan-500"
                >
                  {t('landing.players.leaderboard')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
