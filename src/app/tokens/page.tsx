'use client';

import { Skeleton } from '@heroui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { hardhat } from 'thirdweb/chains';
import { ConnectButton } from 'thirdweb/react';

import { useAuth } from '@/context/AuthContext';
import { client, wallets } from '@/lib/thidweb';

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
  const { isConnected, isLoading: isAuthLoading } = useAuth();

  const { data: holdings, isLoading } = useQuery<
    | {
        data: Holdings;
      }
    | {
        error: string;
      }
  >({
    queryKey: ['icoHoldings', isConnected],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ico/holdings`,
        {
          credentials: 'include',
        },
      );
      return response.json();
    },
  });

  if (holdings && 'error' in holdings) {
    return <div>Error: {holdings.error}</div>;
  }

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

        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Investment Section */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-4">
                {t('tokensPage.investment')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.principal')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-blue-400 before:bg-gradient-to-r before:from-blue-400 before:via-[#ffffff40] before:to-blue-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-2xl font-bold text-blue-400">
                      {holdings?.data.investment.principal.toLocaleString()}{' '}
                      $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.bonus')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-2xl font-bold text-emerald-400">
                      {holdings?.data.investment.bonus.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.totalInvestment')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-indigo-400 before:bg-gradient-to-r before:from-indigo-400 before:via-[#ffffff40] before:to-indigo-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-3xl font-bold text-indigo-400">
                      {holdings?.data.investment.total.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-4">
                {t('tokensPage.balance')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.totalBalance')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-cyan-500 before:bg-gradient-to-r before:from-cyan-500 before:via-[#ffffff40] before:to-cyan-500"
                    isLoaded={!isLoading}
                  >
                    <p className="text-3xl font-bold text-cyan-400">
                      {holdings?.data.balance.total.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.bonus')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-2xl font-bold text-emerald-400">
                      {holdings?.data.balance.staking.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.totalInvestment')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-indigo-400 before:bg-gradient-to-r before:from-indigo-400 before:via-[#ffffff40] before:to-indigo-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-3xl font-bold text-indigo-400">
                      {holdings?.data.balance.total.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
              </div>
            </div>

            {/* Claimable Section */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-4">
                {t('tokensPage.claimable')}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.claimableTokens')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-amber-400 before:bg-gradient-to-r before:from-amber-400 before:via-[#ffffff40] before:to-amber-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-2xl font-bold text-amber-400">
                      {holdings?.data.claimable.tokens.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.claimableStaking')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-2xl font-bold text-emerald-400">
                      {holdings?.data.claimable.staking.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">
                    {t('tokensPage.totalClaimable')}
                  </p>
                  <Skeleton
                    className="rounded-sm bg-purple-400 before:bg-gradient-to-r before:from-purple-400 before:via-[#ffffff40] before:to-purple-400"
                    isLoaded={!isLoading}
                  >
                    <p className="text-3xl font-bold text-purple-400">
                      {holdings?.data.claimable.total.toLocaleString()} $AMZ
                    </p>
                  </Skeleton>
                </div>
                <p>{holdings?.data.claimable.nextClaim.toLocaleString()}</p>
                <button className="mt-4 bg-amber-500 text-black font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors border-2 border-neutral-950 w-full">
                  {t('tokensPage.claim')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-2xl font-bold text-gray-300 mb-10 mt-4">
              {t('tokensPage.investment')}
            </h3>
            <ConnectButton
              chain={hardhat}
              client={client}
              signInButton={{
                label: t('tokenPurchase.form.connectWallet'),
                className:
                  'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
              }}
              connectButton={{
                label: t('tokenPurchase.form.connectWallet'),
                className:
                  'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
              }}
              switchButton={{
                className:
                  'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
              }}
              appMetadata={{
                name: 'Mythic Miners',
                url: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
                logoUrl: '/assets/images/logo.webp',
              }}
              autoConnect={{ timeout: 10000 }}
              connectModal={{
                size: 'compact',
                termsOfServiceUrl: 'https://mythicminers.com/terms-of-use',
                privacyPolicyUrl: 'https://mythicminers.com/privacy-policy',
                showThirdwebBranding: false,
              }}
              wallets={wallets}
              auth={{
                isLoggedIn: async () => {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/is-logged-in`,
                    {
                      credentials: 'include',
                    },
                  );
                  const data = await response.json();
                  console.log('isLoggedIn', data.data);
                  return data.data;
                },
                doLogin: async (params) => {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(params),
                  });
                },
                getLoginPayload: async ({ address }) => {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login-payload`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify({ address }),
                    },
                  );

                  const data = await response.json();
                  console.log('getLoginPayload', data.data);
                  return data.data;
                },
                doLogout: async () => {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                  );
                  const data = await response.json();
                  console.log('doLogout', data);
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
