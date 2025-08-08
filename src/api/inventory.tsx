'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

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
  gameAmazonites: number;
  gachaVouchers: number;
  inventory: InventoryItem[];
  summary: {
    totalEquipments: number;
    totalBetaKeys: number;
    totalRelics: number;
    totalNFTs: number;
  };
}

export interface GachaResponse {
  data: {
    equipment: {
      image: string;
      name: string;
      description: string;
      attributes: Array<{
        trait_type: string;
        value: string | number;
        display_type?: string;
      }>;
    };
    message: string;
  };
}

export interface GachaInGameBuyResponse {
  data: {
    message: string;
  };
}

export interface GachaBuyResponse {
  data: {
    gachaQuantity: number;
  };
}

export const useInventoryQuery = () =>
  useQuery<{
    data: Inventory;
  }>({
    queryKey: ['/inventory'],
  });

export const useGachaMutation = () =>
  useMutation<GachaResponse, Error>({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/gacha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      if (!response.ok) throw new Error('Failed to call gacha');
      return response.json();
    },
  });

export const useGachaBuyMutation = () =>
  useMutation<GachaBuyResponse, Error, string>({
    mutationFn: async (transactionHash: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/gacha/buy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            transactionHash,
          }),
        },
      );
      if (!response.ok) throw new Error('Failed to call gacha');
      return response.json();
    },
  });

export const useGachaInGameBuyMutation = () =>
  useMutation<GachaInGameBuyResponse, Error, number>({
    mutationFn: async (vouchers: number) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/gacha/in-game-buy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            vouchers,
          }),
        },
      );
      if (!response.ok) throw new Error('Failed to call gacha');
      return response.json();
    },
  });
