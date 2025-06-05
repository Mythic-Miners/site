'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <Image
          src="/assets/images/logo.webp"
          alt="Mythic Miners"
          width={50}
          height={50}
        />
        <h1 className="sm:block hidden text-2xl font-bold text-yellow-50 font-ceaser ml-4 mythic-text-shadow">
          Mythic Miners
        </h1>
      </div>

      <div className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <LanguageSwitcher />
        <Link
          className="border-2 border-black hover:bg-[#fefce9b5]  bg-[#fefce996] cursor-pointer text-black font-bold py-2 px-4 rounded-md transition-colors "
          style={{ animationDelay: '0ms' }}
          href="/tokens"
        >
          {t('common.viewMyTokens')}
        </Link>
      </div>
    </header>
  );
}
