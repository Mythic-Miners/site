'use client';

import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useClaimMutation,
  useClaimStatusQuery,
} from '@/api/claim';
import { useLanguage } from '@/context/LanguageContext';

const getTaxRate = (amount: number) => {
  if (amount >= 1500) return 0;
  if (amount >= 1000) return 0.2;
  if (amount >= 500) return 0.4;
  return 0.5;
};

export default function ClaimPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [amount, setAmount] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const {
    data: statusData,
    isLoading: isStatusLoading,
    refetch,
  } = useClaimStatusQuery();

  const {
    mutate: submitClaim,
    isPending: isSubmitting,
  } = useClaimMutation();

  const parsedAmount = useMemo(() => {
    const raw = amount.replace(',', '.').trim();
    const value = Number(raw);
    if (!Number.isFinite(value)) return 0;
    return Math.min(value, 1500);
  }, [amount]);

  const taxDetails = useMemo(() => {
    if (parsedAmount <= 0) {
      return {
        rate: 0,
        net: 0,
      };
    }
    const rate = getTaxRate(parsedAmount);
    return {
      rate,
      net: parsedAmount * (1 - rate),
    };
  }, [parsedAmount]);

  const hasClaimedThisMonth = statusData?.data?.claimed ?? false;

  const isAmountValid = parsedAmount > 0;

  const formatAmount = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value.toLocaleString(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!hasInteracted) setHasInteracted(true);
    const { value } = event.target;
    const numericValue = Number(value);
    if (Number.isFinite(numericValue) && numericValue > 1500) {
      setAmount('1500');
      return;
    }
    setAmount(value);
  };

  const handleSubmit = () => {
    if (!isAmountValid || hasClaimedThisMonth || isSubmitting) {
      setHasInteracted(true);
      return;
    }

    submitClaim(
      { amount: parsedAmount },
      {
        onSuccess: (response) => {
          const net = response.data?.netAmount ?? taxDetails.net;
          const rate = response.data?.taxRate ?? taxDetails.rate;
          addToast({
            title: t('claim.feedback.successTitle'),
            description: t('claim.feedback.successDescription', {
              net: formatAmount(net),
              rate: Math.round(rate * 100),
            }),
            color: 'success',
            variant: 'flat',
          });
          setAmount('');
          setHasInteracted(false);
          refetch();
        },
        onError: (error) => {
          addToast({
            title: t('claim.feedback.errorTitle'),
            description: error.message || t('claim.feedback.errorDescription'),
            color: 'danger',
            variant: 'flat',
          });
        },
      },
    );
  };

  const taxRatePercentage = Math.round(taxDetails.rate * 100);
  const netAmountDisplay = formatAmount(taxDetails.net);

  // const isButtonDisabled =
  //   !isAmountValid || hasClaimedThisMonth || isSubmitting;
  const isButtonDisabled = true;

  return (
    <div className="text-neutral-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-50 mythic-text-shadow">
            {t('claim.title')}
          </h1>
          <p className="mt-3 text-neutral-300 max-w-3xl">
            {t('claim.subtitle')}
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <Card className="bg-indigo-950 border-2 border-black shadow-lg p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('claim.form.heading')}
              </h2>
              <p className="mt-2 text-neutral-300">
                {t('claim.form.description')}
              </p>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-800 rounded-xl p-4 sm:p-5 min-h-[88px] flex items-center">
              <div className="space-y-2 w-full">
                <p
                  className={`font-medium ${hasClaimedThisMonth
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                    }`}
                >
                  {hasClaimedThisMonth
                    ? t('claim.status.alreadyClaimed')
                    : t('claim.status.available')}
                </p>
                {isStatusLoading && (
                  <p className="text-xs text-neutral-500">
                    {t('common.loading')}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-neutral-400 text-sm">
                {t('claim.form.amountLabel')}
              </label>
              <Input
                type="number"
                min="0"
                max="1500"
                placeholder="1500"
                value={amount}
                onChange={handleAmountChange}
                labelPlacement="outside"
                classNames={{
                  inputWrapper:
                    'border-2 border-black rounded-xl h-12 outline-none',
                  input: 'text-lg text-neutral-100 outline-none',
                }}
                errorMessage={
                  hasInteracted && !isAmountValid
                    ? t('claim.form.amountError')
                    : undefined
                }
                isInvalid={hasInteracted && !isAmountValid}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-indigo-900/40 border border-indigo-800 rounded-xl p-4">
                  <p className="text-sm text-neutral-400">
                    {t('claim.form.taxRateLabel')}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-300">
                    {isAmountValid
                      ? t('claim.form.taxRateValue', {
                        value: taxRatePercentage,
                      })
                      : t('claim.form.taxRatePlaceholder')}
                  </p>
                </div>
                <div className="bg-indigo-900/40 border border-indigo-800 rounded-xl p-4">
                  <p className="text-sm text-neutral-400">
                    {t('claim.form.netAmountLabel')}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">
                    {isAmountValid && netAmountDisplay
                      ? `${netAmountDisplay} $AMZ`
                      : t('claim.form.netAmountPlaceholder')}
                  </p>
                  {isAmountValid && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {t('claim.form.netAmountHelp')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <Button
                isDisabled={isButtonDisabled}
                onPress={handleSubmit}
                className="border-2 border-black w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-transform hover:translate-y-[-1px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* {isSubmitting
                  ? t('claim.form.submitLoading')
                  : hasClaimedThisMonth
                    ? t('claim.form.submitDisabled')
                    : t('claim.form.submit')} */}
                Coming Soon
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-indigo-950 border-2 border-black shadow-lg p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-cyan-300 mythic-text-shadow">
                {t('claim.taxRules.title')}
              </h2>
              <p className="text-neutral-300 text-sm">
                {t('claim.taxRules.description')}
              </p>
              <ul className="space-y-3 text-sm text-neutral-200">
                <li className="bg-indigo-900/40 border border-indigo-800 rounded-lg px-4 py-3">
                  {t('claim.taxRules.bracketHigh')}
                </li>
                <li className="bg-indigo-900/40 border border-indigo-800 rounded-lg px-4 py-3">
                  {t('claim.taxRules.bracketMid')}
                </li>
                <li className="bg-indigo-900/40 border border-indigo-800 rounded-lg px-4 py-3">
                  {t('claim.taxRules.bracketLow')}
                </li>
                <li className="bg-indigo-900/40 border border-indigo-800 rounded-lg px-4 py-3">
                  {t('claim.taxRules.bracketBase')}
                </li>
              </ul>
            </Card>

            <Card className="bg-indigo-950 border-2 border-black shadow-lg p-6 space-y-3">
              <h3 className="text-xl font-semibold text-emerald-300 mythic-text-shadow">
                {t('claim.reminder.title')}
              </h3>
              <p className="text-sm text-neutral-300">
                {t('claim.reminder.description')}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
