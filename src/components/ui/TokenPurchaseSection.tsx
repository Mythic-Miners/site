'use client';

import React, { useEffect, useState } from 'react';

import StackedNFTs from './StackedNFTs';
import TokenPurchaseForm from './TokenPurchaseForm';

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

export interface Stage {
  stage: number;
  bonus: number;
  vestingPeriod: number;
  description: string;
  totalRaised: number;
  apr: number;
}

const currentStage: Stage = {
  stage: 1,
  bonus: 60,
  vestingPeriod: 6,
  description: 'Limited time offer with maximum bonus',
  totalRaised: 900,
  apr: 10,
};

const BONUS_BOXES = {
  tier1: {
    title: 'Pioneiro Mítico',
    description: (percentage: number) =>
      `Ganhe ${percentage}% de bônus na compra e faça parte do grupo exclusivo que vai surfar na alta do token!`,
    image: '/assets/images/tokens.png',
    minAmount: 0,
    maxAmount: 430,
  },
  tier2: {
    title: 'Explorador Épico',
    description: (percentage: number) =>
      `${percentage}% de bônus nos tokens do ICO + NFT de uma relíquia épica, que aumenta em 10% sua transferência diária de tokens no jogo`,
    image: '/assets/images/relic-t4.png',
    minAmount: 430,
    maxAmount: 2150,
  },
  tier3: {
    title: 'Visionário Lendário',
    description: (percentage: number) =>
      `${percentage}% de bônus nos tokens do ICO + NFT de uma relíquia lendária, que aumenta em 20% sua transferência diária de tokens no jogo`,
    image: '/assets/images/relic-t5.png',
    minAmount: 2150,
    maxAmount: 4300,
  },
  tier4: {
    title: 'Guardião Atemporal',
    description: (percentage: number) =>
      `${percentage}% de bônus nos tokens do ICO + NFT de uma relíquia atemporal, que aumenta em 40% sua transferência diária de tokens no jogo`,
    image: '/assets/images/relic-t6.png',
    minAmount: 4300,
    maxAmount: Infinity,
  },
};

export default function TokenPurchaseSection() {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    payment: 'POL',
    wallet: '',
    paymentMethod: 'wallet',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTier, setCurrentTier] =
    useState<keyof typeof BONUS_BOXES>('tier1');

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount >= BONUS_BOXES.tier4.minAmount) {
      setCurrentTier('tier4');
    } else if (amount >= BONUS_BOXES.tier3.minAmount) {
      setCurrentTier('tier3');
    } else if (amount >= BONUS_BOXES.tier2.minAmount) {
      setCurrentTier('tier2');
    } else {
      setCurrentTier('tier1');
    }
  }, [formData.amount]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount of tokens';
    }

    if (
      formData.paymentMethod === 'wallet' &&
      (!formData.wallet ||
        !formData.wallet.startsWith('0x') ||
        formData.wallet.length !== 42)
    ) {
      newErrors.wallet = 'Please enter a valid wallet address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
          amount: '',
          payment: 'POL',
          wallet: '',
          paymentMethod: 'wallet',
        });
      }, 1500);
    }
  };

  return (
    <section className="container mx-auto mt-20 px-4 py-20 flex flex-col lg:flex-row gap-8">
      {/* Left Side - Form */}
      <div className="lg:w-1/2">
        <TokenPurchaseForm
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          handleChange={handleChange}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          currentStage={currentStage}
        />
      </div>

      {/* Right Side - Dynamic Boxes */}
      <div className="lg:w-1/2 flex">
        <StackedNFTs
          bonusBoxes={BONUS_BOXES}
          currentTier={currentTier}
          stageBonus={currentStage.bonus}
        />
      </div>
    </section>
  );
}
