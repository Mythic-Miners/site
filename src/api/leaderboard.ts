'use client';

import { useQuery } from '@tanstack/react-query';

export type EquipmentSlotKey =
  | 'helmet'
  | 'pickaxe'
  | 'armour'
  | 'jetpack'
  | 'belt'
  | 'trinket'
  | 'relic';

export interface EquipmentSlotData {
  tokenId: number;
  rarity?: string;
  grade?: string;
  type: string;
  points: number;
  contractAddress: string;
  name?: string;
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  username?: string;
  address: string;
  equipments: Record<EquipmentSlotKey, EquipmentSlotData | null>;
  computedAt: string | null;
  currentUser: boolean;
}

interface LeaderboardApiResponse {
  data: {
    top100: LeaderboardEntry[];
    aroundUser: LeaderboardEntry[];
    updatedAt: string | null;
  };
}

export const useLeaderboardQuery = () =>
  useQuery<LeaderboardApiResponse>({
    queryKey: ['/leaderboard'],
  });
