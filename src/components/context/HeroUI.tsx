'use client';

import { HeroUIProvider as HeroUIProviderBase } from '@heroui/system';

export const HeroUIProvider = ({ children }: { children: React.ReactNode }) => {
  return <HeroUIProviderBase>{children}</HeroUIProviderBase>;
};
