'use client';

import { useQuery } from '@tanstack/react-query';

export interface Airdrop {
  balance: number;
  total: number;
  claimable: number;
  nextClaim: Date;
}

export interface AirdropLeaderboard {
  position: number;
  address: string;
  points: number;
  tier: string;
  currentUser: boolean;
}

export interface AirdropInventory {
  airdropItems: {
    _id: string;
    userId: string;
    userAddress: string;
    originalItem: string;
    equipmentType: string;
    rarity: string;
    grade: string;
    metadata: {
      image: string;
      name: string;
      description: string;
      attributes: Array<{
        trait_type: string;
        value: string | number;
        display_type?: string;
      }>;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
  subscriptions: {
    _id: string;
    userId: string;
    plan: string;
    startDate: Date;
    endDate: Date;
    autoRenew?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  betaKey: {
    item: string;
    quantity: number;
  };
}

export const useAirdropQuery = () =>
  useQuery<{
    data: Airdrop;
  }>({
    queryKey: ['/airdrop'],
  });

export const useAirdropLeaderboardQuery = () =>
  useQuery<{
    data: AirdropLeaderboard[];
  }>({
    queryKey: ['/airdrop/leaderboard'],
  });

export const useAirdropInvetoryQuery = () =>
  useQuery<{
    data: AirdropInventory;
  }>({
    queryKey: ['/airdrop/inventory'],
  });
