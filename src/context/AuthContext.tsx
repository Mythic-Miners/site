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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);

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

  useEffect(() => {
    if (autoConnected && account?.address) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/is-logged-in`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then(() => {
          setIsLoggedIn(undefined);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
  }, [autoConnected, account]);

  console.log('isJwtPresent', isJwtPresent);
  console.log('isLoading', isLoading);
  console.log('autoConnected', autoConnected);
  console.log('account', account);
  return (
    <AuthContext.Provider
      value={{
        isConnected:
          isLoggedIn === false
            ? false
            : (autoConnected && !!account?.address) || isJwtPresent,
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
