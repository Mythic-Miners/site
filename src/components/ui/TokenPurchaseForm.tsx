import { Skeleton } from '@heroui/skeleton';
import { Slider } from '@heroui/slider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { hardhat } from 'thirdweb/chains';
import { ConnectButton } from 'thirdweb/react';
import { createWallet, inAppWallet } from 'thirdweb/wallets';

import type { IcoStatus } from '@/api/status';
import { client } from '@/lib/thirdweb/client';

import TransferTokensButton from './TransferTokensButton';

interface FormData {
  amount: string;
  payment: string;
  wallet: string;
  paymentMethod: 'wallet' | 'card';
}

interface FormErrors {
  amount?: string;
  wallet?: string;
}

const STAGE_MAX_RAISE = 10000;

const POL_TO_AMZ_RATE = 0.15;

const AMOUNT_BREAKPOINTS = [
  { value: 430, label: 'Epic' },
  { value: 2150, label: 'Legendary' },
  { value: 4300, label: 'Timeless' },
];

type TokenPurchaseFormProps = {
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: (formData: FormData) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  icoStatus?: IcoStatus;
  isLoading: boolean;
};

const wallets = [
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook'],
    },
    hidePrivateKeyExport: true,
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('com.binance.wallet'),
  createWallet('com.roninchain.wallet'),
];

export default function TokenPurchaseForm({
  handleSubmit,
  handleChange,
  setFormData,
  formData,
  errors,
  isSubmitting,
  icoStatus,
  isLoading,
}: TokenPurchaseFormProps) {
  const { t } = useTranslation();
  const stage = icoStatus?.stage ?? 1;
  const totalRaised = icoStatus?.totalRaised ?? 500;
  const bonus = icoStatus?.bonus ?? 60;
  const stagePercentage =
    100 - ((STAGE_MAX_RAISE * stage - totalRaised) / STAGE_MAX_RAISE) * 100;
  const amzAmount = Number(
    (Number(formData.amount) * POL_TO_AMZ_RATE).toFixed(2),
  );
  const bonusAmzAmount = bonus
    ? Number(
        ((Number(formData.amount) * bonus * POL_TO_AMZ_RATE) / 100).toFixed(2),
      )
    : 0;
  const totalAmzAmount = Number((amzAmount + bonusAmzAmount).toFixed(2));

  return (
    <div className="bg-linear-to-b from-blue-950/80 to-gray-900/80 p-4 md:p-8 rounded-xl shadow-xl border-2 border-neutral-950">
      <h2 className="text-3xl font-bold mb-6 text-center text-cyan-500 mythic-text-shadow">
        {t('tokenPurchase.title')}
      </h2>
      <div className="mb-8 bg-gray-800/50 p-3 md:p-6 rounded-lg border border-neutral-950">
        <div className="flex justify-between items-center mb-4">
          <Skeleton
            className="rounded-sm bg-cyan-500 before:bg-gradient-to-r before:from-cyan-500 before:via-[#ffffff40] before:to-cyan-500"
            isLoaded={!isLoading}
          >
            <h3 className="text-xl font-bold text-cyan-500">
              {t('tokenPurchase.stage.label')}: {stage}
            </h3>
          </Skeleton>
          <Skeleton
            className="rounded-full bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
            isLoaded={!isLoading}
          >
            <div className="bg-emerald-400 text-emerald-100 px-3 py-1 rounded-full text-sm font-medium">
              {bonus}% {t('tokenPurchase.bonus.label')}
            </div>
          </Skeleton>
        </div>
        <div className="flex flex-col gap-1 w-full mx-auto mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5 ">
            <div
              className="bg-cyan-500 h-2.5 rounded-full max-w-full border border-neutral-950"
              style={{
                width: `${stagePercentage}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{(stage - 1) * STAGE_MAX_RAISE} POL</span>
            <span>{stage * STAGE_MAX_RAISE} POL</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4 text-sm">
          {t('tokenPurchase.stage.description')}
        </p>
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 min-w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {t('tokenPurchase.bonus.description', {
              bonus: icoStatus?.bonus ?? 'X',
            })}
          </span>
        </div>
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 min-w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {t('tokenPurchase.staking.description', {
              apr: icoStatus?.apr ?? 'X',
            })}
          </span>
        </div>
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 min-w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {t('tokenPurchase.vesting.period', {
              period: icoStatus?.vestingPeriod ?? 'X',
            })}
          </span>
        </div>
        <div className="flex items-center text-gray-400 text-sm mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 min-w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t('tokenPurchase.vesting.cliff')}</span>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 min-w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t('tokenPurchase.tokenRate', { rate: POL_TO_AMZ_RATE })}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('tokenPurchase.form.amount.label')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`bg-gray-800 border-neutral-950 outline-none block w-full pl-4 pr-12 py-3 sm:text-sm border ${errors.amount ? 'border-red-500' : 'border-gray-700'} rounded-md text-white`}
              placeholder={t('tokenPurchase.form.amount.placeholder')}
              min="15"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">POL</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('tokenPurchase.form.amount.minAmount')}
          </p>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>
        <div className="mt-2 mb-8">
          <Slider
            classNames={{
              track: 'border-cyan-500 border-s-cyan-500!',
              filler:
                'bg-gradient-to-r from-cyan-500 from-0% via-cyan-500 via-50% to-amber-400 to-90%',
              thumb: 'bg-gradient-to-r from-cyan-400 to-amber-500',
              step: 'data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50',
              trackWrapper: 'text-gray-200',
            }}
            minValue={0}
            maxValue={AMOUNT_BREAKPOINTS[2].value}
            value={Number(formData.amount)}
            showSteps
            step={AMOUNT_BREAKPOINTS[0].value}
            onChange={(value) => {
              setFormData({ ...formData, amount: value.toString() });
            }}
            marks={AMOUNT_BREAKPOINTS.map((point) => ({
              value: point.value,
              label: point.label,
            }))}
          />
        </div>

        <div className="mb-4 md:mb-8 bg-gray-800/50 p-3 md:p-6 rounded-lg border border-neutral-950">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm md:text-md font-bold text-gray-300">
              {t('tokenPurchase.form.summary.purchased')}
            </h4>
            <div className="text-md md:text-lg font-bold text-gray-300">
              {amzAmount} $AMZ
            </div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm md:text-md font-bold text-gray-300">
              {t('tokenPurchase.form.summary.bonus')}
            </h4>
            <Skeleton
              className="rounded-sm bg-emerald-400 before:bg-gradient-to-r before:from-emerald-400 before:via-[#ffffff40] before:to-emerald-400"
              isLoaded={!isLoading}
            >
              <div className="text-md md:text-lg font-bold text-emerald-400">
                {bonusAmzAmount} $AMZ
              </div>
            </Skeleton>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="text-sm md:text-md font-bold text-gray-300">
              {t('tokenPurchase.form.summary.total')}
            </h4>
            <Skeleton
              className="rounded-sm bg-amber-400 before:bg-gradient-to-r before:from-amber-400 before:via-[#ffffff40] before:to-amber-400"
              isLoaded={!isLoading}
            >
              <div className="text-md md:text-lg font-bold text-amber-400 mythic-text-shadow">
                {totalAmzAmount} $AMZ
              </div>
            </Skeleton>
          </div>
        </div>

        {/* Payment Method Buttons */}
        <div className="flex space-x-4 flex-col md:flex-row gap-2 [&>button]:flex-1!">
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
          <TransferTokensButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
