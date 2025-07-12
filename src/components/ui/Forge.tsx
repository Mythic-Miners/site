'use client';

import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Image } from '@heroui/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Forge() {
  const { t } = useTranslation();

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 bg-indigo-950 p-6 rounded-lg border-2 border-black">
      {/* Forge Animation */}
      <div>
        <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
          {t('inventory.forge.title')}
        </h2>

        <Card
          className="bg-gray-400/30 border-2 border-black flex items-center justify-center mb-6 py-8"
          radius="lg"
        >
          <div className="flex items-center justify-center space-x-4 my-[36px]">
            {/* First equipment slot */}
            <div className="bg-gray-600/50 border-2 border-dashed border-gray-400 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
              <Image
                src="/assets/images/placeholder-pickaxe.webp"
                alt="Equipment Slot 1"
                className="w-16 h-16 object-contain filter grayscale opacity-50"
                height={64}
                width={64}
              />
            </div>
            <div className="text-cyan-500 text-3xl font-bold">+</div>
            <div className="bg-gray-600/50 border-2 border-dashed border-gray-400 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
              <Image
                src="/assets/images/placeholder-pickaxe.webp"
                alt="Equipment Slot 1"
                className="w-16 h-16 object-contain filter grayscale opacity-50"
                height={64}
                width={64}
              />
            </div>

            {/* Plus icon */}
            <div className="text-cyan-500 text-3xl font-bold">+</div>

            {/* Second equipment slot */}
            <div className="bg-gray-600/50 border-2 border-dashed border-gray-400 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
              <Image
                src="/assets/images/placeholder-pickaxe.webp"
                alt="Equipment Slot 2"
                className="w-16 h-16 object-contain filter grayscale opacity-50"
                height={64}
                width={64}
              />
            </div>

            {/* Equals icon */}
            <div className="text-cyan-500 text-3xl font-bold">=</div>

            {/* Result slot */}
            <div className="bg-gradient-to-br from-purple-500/20 to-yellow-500/20 border-2 border-dashed border-yellow-400 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
              <div className="text-yellow-400 text-2xl">?</div>
            </div>
          </div>
        </Card>

        <Button
          isDisabled
          className="border-2 border-black w-full bg-gray-600 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
          size="lg"
        >
          {t('inventory.forge.comingSoon')}
        </Button>
      </div>

      {/* Forge Info */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow blur-xs">
          {t('inventory.forge.info')}
        </h2>

        <div className="flex-1 blur-xs">
          <div className="space-y-4 mb-6">
            <div className="text-sm text-gray-400">
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">
                  {t('inventory.forge.features')}:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                    <span>{t('inventory.forge.feature1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                    <span>{t('inventory.forge.feature2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                    <span>{t('inventory.forge.feature3')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                    <span>{t('inventory.forge.feature4')}</span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">
                  {t('inventory.forge.upgradeChances')}:
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                      <span>{t('inventory.forge.success')}</span>
                    </div>
                    <span>65%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      <span>{t('inventory.forge.criticalSuccess')}</span>
                    </div>
                    <span>15%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span>{t('inventory.forge.failure')}</span>
                    </div>
                    <span>20%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-600/50 text-black font-bold text-xl py-3 px-6 flex items-center md:justify-end rounded-lg">
        <div className="text-center w-auto md:w-[50%]">
          <div className="flex items-center justify-center ">
            <div className="h-10 bg-gray-400 rounded-lg border-2 border-gray-800 px-4 text-gray-800 flex items-center justify-center">
              {t('inventory.forge.comingSoon')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
