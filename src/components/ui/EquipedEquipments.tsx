'use client';

import { Image } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { InventoryItem } from '@/api/inventory';
import { getRarityColor } from '@/lib/consts';

interface EquippedSlots {
  Helmet?: InventoryItem;
  Relic?: InventoryItem;
  Jetpack?: InventoryItem;
  Pickaxe?: InventoryItem;
  Armour?: InventoryItem;
  Trinket?: InventoryItem;
  Belt?: InventoryItem;
}

interface EquipedEquipmentsProps {
  equippedSlots: EquippedSlots;
  onItemClick: (item: InventoryItem) => void;
}

export default function EquipedEquipments({
  equippedSlots,
  onItemClick,
}: EquipedEquipmentsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-indigo-950 p-6 rounded-lg border-2 border-black h-full flex flex-col">
      <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
        {t('inventory.equipped.title')}
      </h2>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto flex-1 content-center">
        {/* Top Row */}
        <div> </div>
        <div
          className={`${getRarityColor(equippedSlots.Helmet)} ${equippedSlots.Helmet ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Helmet && onItemClick(equippedSlots.Helmet)
          }
        >
          {equippedSlots.Helmet ? (
            <Image
              src={equippedSlots.Helmet.metadata?.image}
              alt={equippedSlots.Helmet.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-helmet.webp'}
              alt={'placeholder-helmet'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>
        <div></div>
        {/* Middle Row */}
        <div
          className={`${getRarityColor(equippedSlots.Jetpack)} ${equippedSlots.Jetpack ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Jetpack && onItemClick(equippedSlots.Jetpack)
          }
        >
          {equippedSlots.Jetpack ? (
            <Image
              src={equippedSlots.Jetpack.metadata?.image}
              alt={equippedSlots.Jetpack.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-jetpack.webp'}
              alt={'placeholder-jetpack'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>
        <div
          className={`${getRarityColor(equippedSlots.Armour)} ${equippedSlots.Armour ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Armour && onItemClick(equippedSlots.Armour)
          }
        >
          {equippedSlots.Armour ? (
            <Image
              src={equippedSlots.Armour.metadata?.image}
              alt={equippedSlots.Armour.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-armour.webp'}
              alt={'placeholder-armour'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>
        <div
          className={`${getRarityColor(equippedSlots.Pickaxe)} ${equippedSlots.Pickaxe ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Pickaxe && onItemClick(equippedSlots.Pickaxe)
          }
        >
          {equippedSlots.Pickaxe ? (
            <Image
              src={equippedSlots.Pickaxe.metadata?.image}
              alt={equippedSlots.Pickaxe.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-pickaxe.webp'}
              alt={'placeholder-pickaxe'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>

        {/* Bottom Row */}
        <div
          className={`${getRarityColor(equippedSlots.Trinket)} ${equippedSlots.Trinket ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Trinket && onItemClick(equippedSlots.Trinket)
          }
        >
          {equippedSlots.Trinket ? (
            <Image
              src={equippedSlots.Trinket.metadata?.image}
              alt={equippedSlots.Trinket.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-trinket.webp'}
              alt={'placeholder-trinket'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>
        <div
          className={`${getRarityColor(equippedSlots.Belt)} ${equippedSlots.Belt ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() => equippedSlots.Belt && onItemClick(equippedSlots.Belt)}
        >
          {equippedSlots.Belt ? (
            <Image
              src={equippedSlots.Belt.metadata?.image}
              alt={equippedSlots.Belt.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <Image
              src={'/assets/images/placeholder-belt.webp'}
              alt={'placeholder-belt'}
              className="w-24 h-24 object-contain filter grayscale opacity-50!"
            />
          )}
        </div>
        <div
          className={`${getRarityColor(equippedSlots.Relic)} ${equippedSlots.Relic ? 'border-solid cursor-pointer hover:scale-105 transition-transform' : 'border-dashed'} aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2`}
          onClick={() =>
            equippedSlots.Relic && onItemClick(equippedSlots.Relic)
          }
        >
          {equippedSlots.Relic ? (
            <Image
              src={equippedSlots.Relic.metadata?.image}
              alt={equippedSlots.Relic.metadata?.name}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center">
              <span className="text-xs text-gray-500">
                {t('inventory.slots.relic')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
