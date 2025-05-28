'use client';

import { createContext, useContext } from 'react';
import type { ThirdwebClient } from 'thirdweb';
import { ThirdwebProvider as ThirdwebProviderBase } from 'thirdweb/react';

import { client } from '@/lib/thirdweb/client';

const ThirdwebContext = createContext<ThirdwebClient | undefined>(undefined);

export const ThirdwebProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThirdwebContext.Provider value={client}>
      <ThirdwebProviderBase>{children}</ThirdwebProviderBase>
    </ThirdwebContext.Provider>
  );
};

export const useThirdwebClient = () => {
  const thirdwebClient = useContext(ThirdwebContext);
  if (thirdwebClient === undefined) {
    throw new Error('useThirdwebClient must be used within a ThirdwebProvider');
  }
  return thirdwebClient;
};
