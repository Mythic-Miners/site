'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function AuthRedirect() {
  const { isConnected } = useAuth();
  if (isConnected) {
    return redirect('/airdrop');
  }
  return null;
}
