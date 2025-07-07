'use client';

import { Card, CardFooter, Image } from '@heroui/react';
import { Skeleton } from '@heroui/skeleton';
import { useTranslation } from 'react-i18next';

import type { InventoryItem } from '@/api/inventory';

interface InventoryProps {
  inventoryItems: InventoryItem[];
  isInventoryLoading: boolean;
  onItemClick: (item: InventoryItem) => void;
}

export default function Inventory({
  inventoryItems,
  isInventoryLoading,
  onItemClick,
}: InventoryProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-indigo-950 p-6 rounded-lg border-2 border-black">
      <h2 className="text-2xl font-bold text-cyan-500 mb-6 mythic-text-shadow">
        {t('inventory.allItems.title')}
      </h2>

      {isInventoryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square bg-gray-400/30 border-2 border-black rounded-xl"
            />
          ))}
        </div>
      ) : inventoryItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto py-4 px-2">
          {inventoryItems.map((item) => (
            <Card
              key={`${item.tokenId}-${item.category}`}
              isFooterBlurred
              // className="border-none bg-gray-600 flex items-center justify-start pt-2 cursor-pointer hover:scale-103 transition-transform"
              className="bg-gray-400/30 border-2 border-black flex items-center justify-start pt-2 cursor-pointer hover:scale-103 transition-transform"
              radius="md"
              isPressable
              onPress={() => {
                onItemClick(item);
              }}
            >
              <Image
                src={item.metadata?.image || '/assets/images/placeholder.png'}
                alt={item.metadata?.name || ''}
                className="pb-2 object-contain"
                height={100}
                width={100}
              />

              <CardFooter className="justify-between border-black border-1 overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                <p className="text-tiny text-white/80 truncate">
                  {item.metadata?.name}
                </p>
              </CardFooter>

              {/* Hover overlay for better UX */}
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">{t('inventory.allItems.empty')}</p>
        </div>
      )}
    </div>
  );
}
