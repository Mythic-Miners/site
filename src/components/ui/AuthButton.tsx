'use client';

import { useTranslation } from 'react-i18next';
import { ConnectButton } from 'thirdweb/react';

import { useAuth } from '@/context/AuthContext';
import { chain, client, wallets } from '@/lib/thidweb';

export default function AuthButton() {
  const { t } = useTranslation();
  const { setIsJwtPresent } = useAuth();
  return (
    <ConnectButton
      chain={chain}
      client={client}
      signInButton={{
        label: t('tokenPurchase.form.connectWallet'),
        className:
          'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
      }}
      connectButton={{
        label: t('tokenPurchase.form.connectWallet'),
        className:
          'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
      }}
      switchButton={{
        className:
          'min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2! bg-cyan-500! hover:bg-cyan-400! text-black! font-bold!',
      }}
      appMetadata={{
        name: 'Mythic Miners',
        url: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
        logoUrl: '/assets/images/logo.webp',
      }}
      autoConnect={{ timeout: 10000 }}
      connectModal={{
        size: 'compact',
        termsOfServiceUrl: 'https://mythicminers.com/terms-of-use',
        privacyPolicyUrl: 'https://mythicminers.com/privacy-policy',
        showThirdwebBranding: false,
      }}
      wallets={wallets}
      auth={{
        isLoggedIn: async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/is-logged-in`,
            {
              credentials: 'include',
            },
          );
          const data = await response.json();
          return data.data;
        },
        doLogin: async (params) => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(params),
          });
          setIsJwtPresent(true);
          console.log('doLogin');
        },
        getLoginPayload: async ({ address }) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login-payload`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ address }),
            },
          );

          const data = await response.json();
          return data.data;
        },
        doLogout: async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          );
          const data = await response.json();
          setIsJwtPresent(false);
        },
      }}
    />
  );
}
