'use client';

import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Image } from '@heroui/image';
import { addToast } from '@heroui/toast';
import { confetti } from '@tsparticles/confetti';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { InventoryItem } from '@/api/inventory';
import {
  type ChristmasGachaResponse,
  useChristmasGachaMutation,
} from '@/api/inventory';
import { getRarityColor } from '@/lib/consts';

interface ChristmasGachaProps {
  onRefetchInventory: () => void;
  gifts: number;
}

const launchConfetti = () => {
  confetti('tsparticles', {
    particleCount: 100,
    spread: 70,
    position: { x: 50, y: 50 },
  });
};

export default function ChristmasGacha({
  onRefetchInventory,
  gifts,
}: ChristmasGachaProps) {
  const { t } = useTranslation();

  const [localGifts, setLocalGifts] = useState(gifts || 0);
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'open' | 'result'>(
    'idle',
  );
  const [result, setResult] = useState<ChristmasGachaResponse | null>(null);

  const { mutate: christmasGachaMutate, isPending, data, isSuccess, isError } =
    useChristmasGachaMutation();

  useEffect(() => {
    setLocalGifts(gifts || 0);
  }, [gifts]);

  useEffect(() => {
    if (!isPending && isSuccess && data) {
      setLocalGifts((prev) => Math.max(0, prev - 1));
      onRefetchInventory();
      setPhase('open');
      launchConfetti();
      setTimeout(() => {
        setPhase('result');
      }, 500);
      setResult(data);
    }

    if (!isPending && isError) {
      setPhase('idle');
      addToast({
        title: t('inventory.christmasGacha.errorTitle'),
        description: t('inventory.christmasGacha.errorDescription'),
        color: 'danger',
        variant: 'flat',
      });
    }
  }, [isPending, isSuccess, data, isError, onRefetchInventory, t]);

  const handlePlay = () => {
    addToast({
      title: t('inventory.christmasGacha.playingToastTitle'),
      description: t('inventory.christmasGacha.playingToastDescription'),
      color: 'warning',
      variant: 'flat',
      timeout: 2000,
    });

    if (localGifts <= 0) return;
    setPhase('shaking');
    christmasGachaMutate();
  };

  const equipment = useMemo(() => result?.data?.equipment, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Christmas Gacha Animation */}
      <div className="bg-indigo-950 p-6 rounded-lg border-2 border-black flex flex-col justify-between">
        <h2 className="text-2xl font-bold text-cyan-500 mythic-text-shadow">
          {t('inventory.christmasGacha.title')}
        </h2>

        <Card
          className="bg-gray-400/30 border-2 border-black flex items-center justify-center mb-6 py-8"
          radius="lg"
        >
          {(phase === 'idle' || phase === 'shaking' || phase === 'open') && (
            <div className="flex items-center justify-center relative my-[36px]">
              <Image
                src="/assets/images/gift.png"
                alt="Christmas Gift"
                className={`w-48 h-48 object-contain ${phase === 'shaking' ? 'shake' : ''}`}
                height={192}
                width={192}
              />
              {phase === 'open' && <div className="light-effect"></div>}
            </div>
          )}

          {phase === 'result' && equipment && (
            <div
              className={`p-8 rounded-lg border-2 ${getRarityColor({
                metadata: equipment,
              } as InventoryItem)}`}
            >
              <Image
                src={equipment.image || '/assets/images/placeholder.png'}
                alt={equipment.name}
                className="w-48 h-48 object-contain"
                height={192}
                width={192}
              />
            </div>
          )}
        </Card>

        <Button
          onPress={handlePlay}
          isDisabled={localGifts <= 0 || isPending}
          className="border-2 border-black w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isPending
            ? t('inventory.christmasGacha.playing')
            : `${t('inventory.christmasGacha.play')} (${localGifts} ${t('inventory.christmasGacha.giftsLabel')})`}
        </Button>
      </div>

      {/* Christmas Gacha Info */}
      <div className="bg-indigo-950 p-6 rounded-lg border-2 border-black flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
          {t('inventory.christmasGacha.info')}
        </h2>

        <div className="flex-1">
          <div className="text-sm text-gray-400 space-y-4">
            <p>{t('inventory.christmasGacha.description')}</p>

            <div>
              <h4 className="text-white font-semibold mb-2">
                {t('inventory.christmasGacha.poolTitle')}
              </h4>
              <ul className="grid grid-cols-2 gap-x-8">
                <li className="flex justify-between">
                  <span>{t('inventory.slots.helmet')}</span>
                  <span>16.7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.slots.jetpack')}</span>
                  <span>16.7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.slots.belt')}</span>
                  <span>16.7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.slots.pickaxe')}</span>
                  <span>16.7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.slots.armour')}</span>
                  <span>16.7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.slots.trinket')}</span>
                  <span>16.7%</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">
                {t('inventory.christmasGacha.detailsTitle')}
              </h4>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span>{t('inventory.christmasGacha.rarity')}</span>
                  <span>{t('inventory.christmasGacha.rarityValue')}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.christmasGacha.grade')}</span>
                  <span>{t('inventory.christmasGacha.gradeValue')}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('inventory.christmasGacha.edition')}</span>
                  <span>{t('inventory.christmasGacha.editionValue')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



