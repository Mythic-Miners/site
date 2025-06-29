'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
} from 'thirdweb/react';

import { chain, client, wallets } from '@/lib/thidweb';

interface AuthContextType {
  isConnected?: boolean;
  isLoading: boolean;
  setIsJwtPresent: (isJwtPresent: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isJwtPresent, setIsJwtPresent] = useState(false);

  const { data: autoConnected, isLoading } = useAutoConnect({
    client: client,
    chain: chain,
    wallets: wallets,
    timeout: 10000,
  });

  const wallet = useActiveWallet();
  const account = useActiveAccount();

  useEffect(() => {
    const handleAccountsChanged = async () => {
      if (autoConnected && wallet) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
        await wallet.disconnect();
      }
    };

    if ('ethereum' in window && wallet) {
      (window.ethereum as any).on?.('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if ('ethereum' in window) {
        (window.ethereum as any)?.removeListener?.(
          'accountsChanged',
          handleAccountsChanged,
        );
      }
    };
  }, [wallet, autoConnected]);

  return (
    <AuthContext.Provider
      value={{
        isConnected: (autoConnected && !!account?.address) || isJwtPresent,
        setIsJwtPresent: setIsJwtPresent,
        isLoading,
      }}
    >
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
