'use client';

import { addToast } from '@heroui/toast';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
} from 'thirdweb/react';
import { prepareTransaction } from 'thirdweb/transaction';

import { chain, client } from '@/lib/thidweb';

type PlanKey = 'vip_1_month' | 'vip_3_months' | 'vip_6_months';

const PLANS: Array<{
  key: PlanKey;
  pricePOL: number;
  popular?: boolean;
  savings?: string;
}> = [
  { key: 'vip_1_month', pricePOL: 39 },
  { key: 'vip_3_months', pricePOL: 100, savings: '14%' },
  { key: 'vip_6_months', pricePOL: 190, savings: '19%' },
];

export default function VipPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const address = useMemo(() => account?.address, [account]);
  const [processingPlan, setProcessingPlan] = useState<PlanKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscriptionSuccess = async (transactionHash: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          transactionHash,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || 'Request failed');

      addToast({
        title: t('vip.successTitle'),
        description: t('vip.successDescription'),
        color: 'success',
      });
    } catch {
      addToast({
        title: t('vip.errorTitle'),
        description: t('vip.errorDescription'),
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
      setProcessingPlan(null);
    }
  };

  function extractRevertReason(errorString: string): string | null {
    const revertReason = JSON.stringify(errorString).match(
      /reverted with reason string '([^']+)'/,
    );
    if (revertReason) {
      return revertReason[1];
    }
    return 'Transaction failed. Please try again.';
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative">
        <div className="container mx-auto px-6 md:px-8 flex flex-col items-center opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          <div className="text-center mb-6">
            <div
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm mb-4 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
              style={{ animationDelay: '300ms' }}
            >
              ✨ {t('vip.exclusive')}
            </div>
            <h1
              className="text-yellow-50 mythic-text-shadow text-5xl md:text-7xl font-bold mb-4 font-ceaser opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]"
              style={{ animationDelay: '500ms' }}
            >
              {t('vip.title')}
            </h1>
            <p
              className="text-yellow-100 text-lg md:text-xl max-w-2xl mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_forwards] mythic-text-shadow"
              style={{ animationDelay: '700ms' }}
            >
              {t('vip.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-50 mythic-text-shadow font-ceaser">
              {t('vip.benefitsTitle')}
            </h2>
            <p className="text-yellow-100 text-lg max-w-2xl mx-auto mythic-text-shadow">
              {t('vip.benefitsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: '❤️', key: 'extraLife' },
              { icon: '💎', key: 'doubleAmazonites' },
              { icon: '🎟️', key: 'gachaDiscount' },
              { icon: '🛍️', key: 'shopDiscount' },
            ].map((benefit, index) => (
              <div
                key={benefit.key}
                className="bg-gradient-to-br from-indigo-900/80 to-indigo-950/80 backdrop-blur-sm border-2 border-black rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-yellow-50 mb-2">
                  {t(`vip.benefits.${benefit.key}`)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-50 mythic-text-shadow font-ceaser">
              {t('vip.plansTitle')}
            </h2>
            <p className="text-yellow-100 text-lg mythic-text-shadow">
              {t('vip.plansSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(({ key, pricePOL, popular, savings }, index) => (
              <div
                key={key}
                className={`relative bg-gradient-to-br from-indigo-800/90 to-indigo-900/90 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards] ${
                  popular
                    ? 'border-amber-500 shadow-2xl shadow-amber-500/20'
                    : 'border-black'
                }`}
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm">
                      🏆 {t('vip.mostPopular')}
                    </div>
                  </div>
                )}

                {savings && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                      -{savings}
                    </div>
                  </div>
                )}

                <div className="text-center flex flex-col justify-between h-full">
                  <h3 className="text-2xl font-bold text-yellow-50 mb-4 font-ceaser">
                    {t(`subscription.${key}`)}
                  </h3>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-yellow-50 mb-2">
                      {pricePOL}
                      <span className="text-lg text-yellow-100 font-normal ml-1">
                        POL
                      </span>
                    </div>
                    {key === 'vip_3_months' && (
                      <div className="text-sm text-yellow-200">
                        <span className="line-through opacity-60">117 POL</span>
                        <span className="ml-2 text-green-400 font-bold">
                          {t('vip.save')} 17 POL
                        </span>
                      </div>
                    )}
                    {key === 'vip_6_months' && (
                      <div className="text-sm text-yellow-200">
                        <span className="line-through opacity-60">234 POL</span>
                        <span className="ml-2 text-green-400 font-bold">
                          {t('vip.save')} 44 POL
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    {/* Loading Overlay */}
                    <div
                      className={`absolute inset-0 bg-gray-600 text-white font-bold py-4 px-6 rounded-xl border-2 border-gray-600 flex items-center justify-center transition-opacity duration-200 z-10 ${
                        isLoading && processingPlan === key
                          ? 'opacity-100'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        {t('vip.processing')}
                      </div>
                    </div>

                    {/* TransactionButton */}
                    <TransactionButton
                      unstyled
                      disabled={!address || isLoading}
                      className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 border-2 disabled:cursor-not-allowed ${
                        popular
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-500 hover:from-amber-600 hover:to-orange-600 hover:scale-105 shadow-lg shadow-amber-500/30'
                          : 'bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 hover:border-cyan-400 hover:scale-105'
                      } ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                      // @ts-ignore
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        if (wallet?.id === 'inApp') {
                          const confirmed = window.confirm(
                            t('vip.confirm', {
                              plan: t(`subscription.${key}`),
                              price: pricePOL,
                            }),
                          );
                          if (!confirmed) {
                            event.preventDefault();
                            return;
                          }
                        }
                        setIsLoading(true);
                        setProcessingPlan(key);
                      }}
                      transaction={() => {
                        return prepareTransaction({
                          client,
                          chain,
                          to: '0x3389fB08D498eFf5c160dE95a606f10753E58fca',
                          value: BigInt(pricePOL * 1e18),
                        });
                      }}
                      onError={(error) => {
                        const revertReason = extractRevertReason(error.message);
                        addToast({
                          title: t('vip.errorTitle'),
                          description:
                            revertReason || t('vip.errorDescription'),
                          color: 'danger',
                        });
                        setIsLoading(false);
                        setProcessingPlan(null);
                      }}
                      onTransactionConfirmed={async (result) => {
                        await handleSubscriptionSuccess(result.transactionHash);
                      }}
                    >
                      {t('vip.buyButton')}
                    </TransactionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="text-center mt-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: '800ms' }}
          >
            <p className="text-yellow-200 text-sm">{t('vip.guarantee')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
