'use client';

import { Card, CardFooter, Image, Tooltip } from '@heroui/react';
import { Skeleton } from '@heroui/skeleton';
import { addToast } from '@heroui/toast';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAirdropInvetoryQuery,
  useAirdropLeaderboardQuery,
  useAirdropQuery,
} from '@/api/airdrop';
import AirdropClaimButton from '@/components/ui/AirdropClaimButton';
import AuthButton from '@/components/ui/AuthButton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AirdropPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const { isConnected } = useAuth();
  const parentRef = useRef<HTMLDivElement>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [clickedOnMint, setClickedOnMint] = useState(false);

  const {
    data: airdropData,
    isLoading: isAirdropLoading,
    refetch: refetchAirdrop,
  } = useAirdropQuery();

  const { data: leaderboardData } = useAirdropLeaderboardQuery();

  const { data: inventoryData, isLoading: isInventoryLoading } =
    useAirdropInvetoryQuery();

  console.log('inventoryData', inventoryData);

  // Create unified inventory items from inventoryData
  const inventoryItems = useMemo(() => {
    if (!inventoryData?.data) return [];

    const items: Array<{
      id: string;
      name: string;
      image?: string;
      type: 'airdropItem' | 'subscription' | 'betaKey';
      isMinted?: boolean;
      plan?: string;
      quantity?: number;
      description?: string;
      attributes?: Array<{
        trait_type: string;
        value: string | number;
        display_type?: string;
      }>;
    }> = [];

    inventoryData.data.airdropItems?.forEach((item) => {
      items.push({
        id: item._id,
        name: item.metadata.name,
        image: item.metadata.image,
        type: 'airdropItem',
        isMinted: true,
        description: item.metadata.description,
        attributes: item.metadata.attributes,
      });
    });

    // Add subscriptions
    inventoryData.data.subscriptions?.forEach((subscription) => {
      items.push({
        id: subscription._id,
        name: `${subscription.plan} Subscription`,
        type: 'subscription',
        image: 'https://cdn.mythicminers.com/assets/site/vip.svg',
        plan: subscription.plan,
        isMinted: true,
      });
    });

    // Add beta key if exists
    if (inventoryData.data.betaKey) {
      items.push({
        id: 'beta-key',
        name: 'BETA Key',
        type: 'betaKey',
        image: 'https://cdn.mythicminers.com/assets/site/beta-key.png',
        quantity: inventoryData.data.betaKey.quantity,
        isMinted: true,
      });
    }

    return items;
  }, [inventoryData]);

  const virtualizer = useVirtualizer({
    count: leaderboardData?.data?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  useEffect(() => {
    if (leaderboardData?.data && parentRef.current) {
      const index =
        leaderboardData?.data.findIndex((user) => user.currentUser) || 0;
      setUserPosition(index);

      parentRef.current.scrollTo({
        top: index * 50 - 25,
        behavior: 'smooth',
      });
    }
  }, [leaderboardData?.data]);

  useEffect(() => {
    if (isConnected) {
      refetchAirdrop();
    }
  }, [isConnected, refetchAirdrop]);

  const isClaimable = useMemo(() => {
    return (
      airdropData?.data?.nextClaim &&
      new Date().getTime() > new Date(airdropData?.data?.nextClaim).getTime() &&
      airdropData?.data?.claimable > 0 &&
      airdropData?.data?.balance > 0
    );
  }, [airdropData]);

  console.log(
    '!inventoryData?.data?.hasMinted',
    inventoryData?.data?.hasMinted,
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-gray-900 p-4">
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
          {t('common.back')}
        </button>

        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
            {t('airdrop.title')}
          </h1>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-gray-900 p-4">
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
        {t('common.back')}
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
          {t('airdrop.title')}
        </h1>

        {/* Token Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              {t('airdrop.totalTokens')}
            </h3>
            <Skeleton
              className="rounded-sm bg-cyan-400 before:bg-gradient-to-r before:from-cyan-400 before:via-[#ffffff40] before:to-cyan-400"
              isLoaded={!isAirdropLoading}
            >
              <p className="text-3xl font-bold text-cyan-400">
                {airdropData?.data?.total.toLocaleString(language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                $AMZ
              </p>
            </Skeleton>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              {t('airdrop.pendingTokens')}
            </h3>
            <Skeleton
              className="rounded-sm bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
              isLoaded={!isAirdropLoading}
            >
              <p className="text-3xl font-bold text-emerald-400">
                {airdropData?.data?.balance.toLocaleString(language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                $AMZ
              </p>
            </Skeleton>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              {t('airdrop.claimableTokens')}
            </h3>
            <Skeleton
              className="rounded-sm bg-amber-400 before:bg-gradient-to-r before:from-amber-400 before:via-[#ffffff40] before:to-amber-400 mythic-text-shadow"
              isLoaded={!isAirdropLoading}
            >
              <p className="text-3xl font-bold text-amber-400">
                {airdropData?.data?.claimable.toLocaleString(language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                $AMZ
              </p>
            </Skeleton>
          </div>
          <div></div>
          <div className="items-center flex flex-col justify-between m-auto">
            <p className="text-xs text-gray-400 mb-0 mt-2">
              {airdropData?.data?.nextClaim &&
                t('tokensPage.claimableDate', {
                  date: new Intl.DateTimeFormat(language, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(airdropData?.data?.nextClaim)),
                })}
            </p>
            <AirdropClaimButton
              disabled={!isClaimable}
              refetchAirdrop={refetchAirdrop}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-20">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
              {t('airdrop.leaderboard')}
            </h2>
            <div
              ref={parentRef}
              className="h-[600px] overflow-auto bg-gray-800/50 rounded-lg border border-neutral-950"
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const entry = leaderboardData?.data[virtualRow.index];
                  const isUserRow = virtualRow.index === userPosition;

                  return (
                    <div
                      key={virtualRow.index}
                      className={`absolute top-0 left-0 w-full px-4 py-3 flex items-center justify-between border-b border-gray-700 ${
                        isUserRow ? 'bg-cyan-500/20' : ''
                      }`}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-gray-300 font-bold w-12">
                          #{entry?.position}
                        </span>
                        <span className="text-gray-300">{entry?.points}</span>
                      </div>
                      <div className="ml-2 flex items-center gap-4">
                        <span className="text-gray-300">{entry?.address}</span>
                        <span
                          className={`font-bold ${getTierColor(entry?.tier)}`}
                        >
                          {getTierText(entry?.tier)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-2">
            <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
              {t('airdrop.items')}
            </h2>
            {isInventoryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square bg-gray-600 rounded-xl mb-4"
                  />
                ))}
              </div>
            ) : inventoryItems.length > 0 ? (
              <div className="lg:h-[540px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
                {inventoryItems.map((item) => (
                  <Card
                    isFooterBlurred
                    className="border-none bg-gray-600 flex items-center justify-start pt-2 h-[180px]"
                    radius="lg"
                    key={item.id}
                  >
                    {item.type === 'airdropItem' && item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-contain"
                          height={140}
                          width={120}
                        />
                        <CardFooter className="justify-between border-white/20 border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                          <p className="text-tiny text-white/80">{item.name}</p>
                        </CardFooter>
                      </>
                    ) : item.type === 'subscription' ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-contain"
                          height={140}
                          width={120}
                        />
                        <CardFooter className="justify-between border-white/20 border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                          <p className="text-tiny text-white/80">
                            {t(`subscription.${item.plan}`)}
                          </p>
                        </CardFooter>
                      </>
                    ) : item.type === 'betaKey' ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-contain mt-4"
                          height={100}
                          width={100}
                        />
                        <CardFooter className="justify-between border-white/20 border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                          <p className="text-tiny text-white/80">
                            {t('beta.title')}
                          </p>
                          <p className="text-tiny text-white/80">
                            {t('beta.quantity', { quantity: item.quantity })}
                          </p>
                        </CardFooter>
                      </>
                    ) : (
                      // <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      //   <span className="text-black font-bold text-lg">
                      //     β
                      //   </span>
                      // </div>
                      <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Unknown</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12 mt-4 bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
                <p className="text-lg">{t('airdrop.noItems')}</p>
              </div>
            )}
            <Tooltip
              content={t('airdrop.alreadyMinted')}
              isDisabled={!inventoryData?.data?.hasMinted || !clickedOnMint}
              showArrow
              placement="top"
              classNames={{
                base: ['before:bg-zinc-600'],
                content: [
                  'py-2 px-4 shadow-xl',
                  'text-neutral-100 bg-zinc-700',
                ],
              }}
            >
              <button
                onClick={async () => {
                  setClickedOnMint(true);
                  setIsMinting(true);
                  try {
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/airdrop`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                    });
                    setTimeout(() => {
                      addToast({
                        title: 'Minted',
                        description: t('airdrop.toastMinted'),
                        color: 'success',
                      });
                      setIsMinting(false);
                    }, 12000);
                  } catch (error) {
                    console.error('Error minting airdrop:', error);
                    addToast({
                      title: 'Error',
                      description: t('airdrop.error'),
                      color: 'danger',
                    });
                  }
                }}
                disabled={
                  clickedOnMint ||
                  isInventoryLoading ||
                  isMinting ||
                  inventoryData?.data?.hasMinted
                }
                className="mt-4 w-full bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors border-2 border-neutral-950 disabled:opacity-50 disabled:grayscale"
              >
                {isMinting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('common.loading')}
                  </div>
                ) : (
                  t('airdrop.mint')
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

const getTierColor = (tier: string | undefined) => {
  switch (tier) {
    case 'TOP1':
      return 'text-yellow-400';
    case 'TOP2':
      return 'text-gray-300';
    case 'TOP3':
      return 'text-amber-600';
    case 'TOP10%':
      return 'text-cyan-500';
    case 'TOP20%':
      return 'text-sky-400';
    case 'TOP50%':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
};

const getTierText = (tier: string | undefined) => {
  switch (tier) {
    case 'TOP1':
      return 'TOP 1';
    case 'TOP2':
      return 'TOP 2';
    case 'TOP3':
      return 'TOP 3';
    case 'TOP10%':
      return 'TOP 10%';
    case 'TOP20%':
      return 'TOP 20%';
    case 'TOP50%':
      return 'TOP 50%';
    default:
      return 'NONE';
  }
};
