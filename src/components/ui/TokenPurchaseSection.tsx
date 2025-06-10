'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useIcoStatusQuery from '@/api/status';

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

// TODO CHANGE THIS

const BONUS_BOXES = {
  tier1: {
    title: 'tokenPurchase.tiers.tier1.title',
    description: 'tokenPurchase.tiers.tier1.description',
    image: '/assets/images/relic-t3.png',
    minAmount: 'tokenPurchase.tiers.tier1.minAmount',
    amout: 100,
  },
  tier2: {
    title: 'tokenPurchase.tiers.tier2.title',
    description: 'tokenPurchase.tiers.tier2.description',
    image: '/assets/images/relic-t4.png',
    minAmount: 'tokenPurchase.tiers.tier2.minAmount',
    amout: 500,
  },
  tier3: {
    title: 'tokenPurchase.tiers.tier3.title',
    description: 'tokenPurchase.tiers.tier3.description',
    image: '/assets/images/relic-t5.png',
    minAmount: 'tokenPurchase.tiers.tier3.minAmount',
    amout: 2500,
  },
  tier4: {
    title: 'tokenPurchase.tiers.tier4.title',
    description: 'tokenPurchase.tiers.tier4.description',
    image: '/assets/images/relic-t6.png',
    minAmount: 'tokenPurchase.tiers.tier4.minAmount',
    amout: 5000,
  },
  tier5: {
    title: 'tokenPurchase.tiers.tier5.title',
    description: 'tokenPurchase.tiers.tier5.description',
    image: '/assets/images/relics-combo.png',
    minAmount: 'tokenPurchase.tiers.tier5.minAmount',
    amout: 10000,
  },
};

export default function TokenPurchaseSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    payment: 'POL',
    wallet: '',
    paymentMethod: 'wallet',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentTier, setCurrentTier] =
    useState<keyof typeof BONUS_BOXES>('tier1');

  const { data: icoStatus, isPending: isIcoStatusLoading } =
    useIcoStatusQuery();

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount >= BONUS_BOXES.tier5.amout) {
      setCurrentTier('tier5');
    } else if (amount >= BONUS_BOXES.tier4.amout) {
      setCurrentTier('tier4');
    } else if (amount >= BONUS_BOXES.tier3.amout) {
      setCurrentTier('tier3');
    } else if (amount >= BONUS_BOXES.tier2.amout) {
      setCurrentTier('tier2');
    } else {
      setCurrentTier('tier1');
    }
  }, [formData.amount]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      newErrors.amount = t('errors.general');
    }

    if (
      formData.paymentMethod === 'wallet' &&
      (!formData.wallet ||
        !formData.wallet.startsWith('0x') ||
        formData.wallet.length !== 42)
    ) {
      newErrors.wallet = t('errors.general');
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
      setTimeout(() => {
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
          icoStatus={icoStatus?.data}
          isLoading={isIcoStatusLoading}
        />
      </div>

      <div className="lg:w-1/2 flex justify-center items-center">
        <StackedNFTs
          bonusBoxes={BONUS_BOXES}
          currentTier={currentTier}
          bonus={icoStatus?.data.bonus}
        />
      </div>
    </section>
  );
}
