'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
} from 'thirdweb/react';

import { chain, client, wallets } from '@/lib/thidweb';
import { useQueryClient } from '@tanstack/react-query';
import { useMeQuery } from '@/api/auth';

interface AuthContextType {
  isConnected?: boolean;
  isLoading: boolean;
  setIsJwtPresent: (isJwtPresent: boolean) => void;
  logout: () => Promise<void>;
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
  const qc = useQueryClient();

  // Memoized logout action
  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
      // ignore
    } finally {
      await wallet?.disconnect?.();
      await qc.invalidateQueries({ queryKey: ['/auth/me'] });
    }
  }, [qc, wallet]);


  useEffect(() => {
    if (autoConnected && account?.address) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/is-logged-in`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then(() => {
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
  }, [autoConnected, account]);

  return (
    <AuthContext.Provider
      value={{
        isConnected:
          isLoggedIn === false
            ? false
            : (autoConnected && !!account?.address) || isJwtPresent,

        setIsJwtPresent: setIsJwtPresent,
        isLoading,
        logout,
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
