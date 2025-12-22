'use client';

import { ThirdwebProvider } from '@/components/context/Thirdweb';
import { HeroUIProvider } from '@/components/context/HeroUI';
import QueryProvider from '@/components/context/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import UsernameGate from '@/components/ui/UsernameGate';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <QueryProvider>
        <AuthProvider>
          <LanguageProvider>
            <HeroUIProvider>
              {children}
              <UsernameGate />
            </HeroUIProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryProvider>
    </ThirdwebProvider>
  );
}
