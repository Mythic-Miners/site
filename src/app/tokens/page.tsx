'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Holdings {
  investment: {
    principal: number;
    bonus: number;
    total: number;
  };
  balance: {
    tokens: number;
    staking: number;
    total: number;
  };
  claimable: {
    tokens: number;
    staking: number;
    total: number;
    nextClaim: Date;
  };
}

export default function TokensPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950/80 to-gray-900/80 p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t('tokensPage.back')}
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
          {t('tokensPage.title')}
        </h1>

        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="max-w-3xl text-center text-2xl font-bold text-gray-300 mb-10 mt-4">
            {t('tokensPage.temp')}
          </h3>
        </div>
      </div>
    </div>
  );
}
