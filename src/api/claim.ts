'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

export interface ClaimStatus {
  claimed: boolean;
}

export interface ClaimStatusResponse {
  data: ClaimStatus;
}

export interface ClaimRequestPayload {
  amount: number;
}

export interface ClaimResponseData {
  amount: number;
  netAmount: number;
  taxRate: number;
  nextClaimAt?: string | null;
  message?: string;
}

export interface ClaimResponse {
  data: ClaimResponseData;
}

export const useClaimStatusQuery = () =>
  useQuery<ClaimStatusResponse>({
    queryKey: ['/claim'],
  });

export const useClaimMutation = () =>
  useMutation<ClaimResponse, Error, ClaimRequestPayload>({
    mutationFn: async ({ amount }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claim`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ amount }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit claim');
      }

      return response.json();
    },
  });
