import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FAKE_PROVIDERS } from './consts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertTokenIdToBlockchain = (tokenId: number | string) => {
  if (process.env.NODE_ENV === 'development') {
    return BigInt(Number(tokenId) - 1000000);
  }
  return BigInt(tokenId);
};

export const isEmailValid = (email: string) => {
  const emailDomain = email.replace(/^[^@]*@/, '');

  return FAKE_PROVIDERS.indexOf(emailDomain) <= -1;
};

// Formats AMZ amounts to 2 decimal places for display
export const formatAMZ = (value: number | string | null | undefined): string => {
  const num = Number(value);
  if (!isFinite(num)) return '0.00';
  return num.toFixed(2);
};
