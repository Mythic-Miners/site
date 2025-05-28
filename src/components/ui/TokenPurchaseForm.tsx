'use client';

import { Slider } from '@heroui/slider';
import React from 'react';

import type { Stage } from './TokenPurchaseSection';

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

const STAGE_MAX_RAISE = 1000;

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
  currentStage: Stage;
};

export default function TokenPurchaseForm({
  handleSubmit,
  handleChange,
  setFormData,
  formData,
  errors,
  isSubmitting,
  currentStage,
}: TokenPurchaseFormProps) {
  return (
    <div className="bg-linear-to-b from-blue-950/80 to-gray-900/80 p-4 md:p-8 rounded-xl shadow-xl border-2 border-neutral-950">
      <h2 className="text-3xl font-bold mb-6 text-center text-cyan-500 mythic-text-shadow">
        $AMZ Pré-venda
      </h2>
      <div className="mb-8 bg-gray-800/50 p-3 md:p-6 rounded-lg border border-neutral-950">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-cyan-500">
            Fase: {currentStage.stage}
          </h3>
          <div className="bg-emerald-400 text-emerald-100 px-3 py-1 rounded-full text-sm font-medium">
            {currentStage.bonus}% Bônus
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full mx-auto mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5 ">
            <div
              className="bg-cyan-500 h-2.5 rounded-full max-w-full border border-neutral-950"
              style={{
                width: `${
                  100 -
                  ((STAGE_MAX_RAISE * currentStage.stage -
                    currentStage.totalRaised) /
                    STAGE_MAX_RAISE) *
                    100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4 text-sm">
          Cada fase tem um valor de 1000 POL, compre logo para garantir os
          melhores benefícios.
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
            Tokens Bônus: Ganhe {currentStage.bonus}% de tokens em cima da sua
            compra
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
          <span>Staking APR: {currentStage.apr}% Anual Percentage Rate</span>
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
            Vesting Period: {currentStage.vestingPeriod} months linear vesting
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
          <span>Cliff Period: 1 month</span>
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
          <span>1 POL = 0.15 Amazonite</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quantidade
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`bg-gray-800 border-neutral-950 outline-none block w-full pl-4 pr-12 py-3 sm:text-sm border ${errors.amount ? 'border-red-500' : 'border-gray-700'} rounded-md text-white`}
              placeholder="100"
              min="15"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">POL</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Mínimo de 15 POL</p>
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
              Amazonite comprados:
            </h4>
            <div className="text-md md:text-lg font-bold text-gray-300">
              {Number(formData.amount) * 0.15} $AMZ
            </div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm md:text-md font-bold text-gray-300">
              Amazonite bônus:
            </h4>
            <div className="text-md md:text-lg font-bold text-emerald-400">
              {(Number(formData.amount) * currentStage.bonus * 0.15) / 100} $AMZ
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="text-sm md:text-md font-bold text-gray-300">
              Total de Amazonite:
            </h4>
            <div className="text-md md:text-lg font-bold text-amber-400 mythic-text-shadow">
              {Number(formData.amount) * 0.15 +
                (Number(formData.amount) * currentStage.bonus * 0.15) /
                  100}{' '}
              $AMZ
            </div>
          </div>
        </div>

        {/* Payment Method Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => {}}
            className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-md transition-colors border-neutral-950 border-2 ${
              formData.paymentMethod === 'wallet'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isSubmitting
              ? 'Processing...'
              : formData.paymentMethod === 'wallet'
                ? 'Connect Wallet & Purchase'
                : 'Proceed to Payment'}
          </button>
          <button
            type="button"
            onClick={() => {}}
            className={`flex-1 py-3 px-4 rounded-md transition-colors border-neutral-950 border-2 ${
              formData.paymentMethod === 'card'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pay with Card
          </button>
        </div>
      </form>
    </div>
  );
}
