'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface MeResponse {
  data: {
    username?: string | null;
  };
  errorMessage?: string;
}

export interface UsernameRequest {
  username: string;
}

export type UsernameResponse =
  | { success: true }
  | { error: 'already-in-use' | 'invalid' | 'already-set' };

export const useMeQuery = (enabled: boolean = true) =>
  useQuery<MeResponse>({
    queryKey: ['/auth/me'],
    // Do not retry auth endpoints to avoid duplicate calls and flashes
    retry: 5,
    enabled,
  });

export const useSetUsernameMutation = () => {
  const qc = useQueryClient();
  return useMutation<UsernameResponse, Error, UsernameRequest>({
    mutationFn: async ({ username }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });
      // server returns 200 with {error: ...} or {success: true}
      const json = await res.json().catch(() => ({}));
      return json as UsernameResponse;
    },
    retry: 2,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/auth/me'] });
    },
  });
};
