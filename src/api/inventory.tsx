'use client';

import { useQuery } from '@tanstack/react-query';

export interface InventoryItem {
  tokenId: number;
  category: 'equipments' | 'relics' | 'betaKey';
  equipmentType?: number;
  isEquipped?: boolean;
  equipmentSlot?: string;
  metadata: {
    image: string;
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
      display_type?: string;
      _id?: string;
    }>;
  } | null;
}

export interface Inventory {
  inventory: InventoryItem[];
  summary: {
    totalEquipments: number;
    totalBetaKeys: number;
    totalRelics: number;
    totalNFTs: number;
  };
}

export const useInventoryQuery = () =>
  useQuery<{
    data: Inventory;
  }>({
    queryKey: ['/inventory'],
  });
