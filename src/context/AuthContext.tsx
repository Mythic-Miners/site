'use client';

import { createContext, useContext } from 'react';
import { useAutoConnect } from 'thirdweb/react';

import { chain, client, wallets } from '@/lib/thidweb';

interface AuthContextType {
  isConnected?: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: autoConnected, isLoading } = useAutoConnect({
    client: client,
    chain: chain,
    wallets: wallets,
    timeout: 10000,
  });

  console.log('addressNA', autoConnected);

  return (
    <AuthContext.Provider value={{ isConnected: autoConnected, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
