'use client';

import { HeroUIProvider as HeroUIProviderBase } from '@heroui/system';
import { ToastProvider } from '@heroui/toast';

export const HeroUIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProviderBase>
      <ToastProvider placement="top-center" />
      {children}
    </HeroUIProviderBase>
  );
};
