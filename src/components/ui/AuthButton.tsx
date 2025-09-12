'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from 'thirdweb/react';

import { useAuth } from '@/context/AuthContext';
import { chain, client, wallets } from '@/lib/thidweb';
import { isEmailValid } from '@/lib/utils';

export default function AuthButton({ header }: { header?: boolean }) {
  const { t } = useTranslation();
  const { setIsJwtPresent } = useAuth();

  useEffect(() => {
    addEventListenerWithRetry(
      `input`,
      'input',
      (event: HTMLElementEventMap['input']) => {
        const email = (event.target as HTMLInputElement).value;

        const sendButton =
          document.querySelector<HTMLElement>(`input + button`);

        if (sendButton) {
          if (isEmailValid(email)) {
            sendButton.removeAttribute('disabled');
            sendButton.style.display = 'inline-flex';
            sendButton.style.pointerEvents = 'all';
          } else {
            sendButton.setAttribute('disabled', 'true');
            sendButton.style.display = 'none';
            sendButton.style.pointerEvents = 'none';
            window.location.reload();
          }
        }
      },
    );
  }, []);

  return (
    <ConnectButton
      chain={chain}
      client={client}
      wallets={wallets}
      theme="dark"
      autoConnect={{ timeout: 10000 }}
      connectModal={{
        size: 'compact',
        termsOfServiceUrl: 'https://mythicminers.com/terms-of-use',
        privacyPolicyUrl: 'https://mythicminers.com/privacy-policy',
        showThirdwebBranding: false,
      }}
      signInButton={{
        label: t('authButtom.logIn'),
        className:
          'bg-gradient-to-r! from-cyan-500! to-cyan-400! min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2!  hover:from-cyan-600! hover:to-cyan-500! text-black! font-bold!',
      }}
      connectButton={{
        label: t('authButtom.logIn'),
        className:
          'bg-gradient-to-r! from-cyan-500! to-cyan-400! min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2!  hover:from-cyan-600! hover:to-cyan-500! text-black! font-bold!',
      }}
      switchButton={{
        className:
          'bg-gradient-to-r! from-cyan-500! to-cyan-400! min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2!  hover:from-cyan-600! hover:to-cyan-500! text-black! font-bold!',
      }}
      appMetadata={{
        name: 'Mythic Miners',
        url: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
        logoUrl: '/assets/images/logo.webp',
      }}
      supportedTokens={{
        [chain.id]: [
          {
            address: '0xA57633357b2A50dF0b8482a8930c49a15006dEB8',
            name: 'Amazonite',
            symbol: 'AMZ',
            icon: 'https://cdn.mythicminers.com/nfts/equipments/helms/rare-birthday.png',
          },
        ],
      }}
      detailsButton={{
        className: header
          ? 'bg-indigo-950/70! hover:bg-indigo-950! min-h-[48px]! max-h-[48px]! flex-1! py-1! md:py-3! px-2! md:px-4! rounded-md! transition-colors! border-neutral-950! border-2!  hover:from-cyan-600! hover:to-cyan-500! text-black! font-bold!'
          : '',
      }}
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
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
          setIsJwtPresent(false);
        },
      }}
    />
  );
}

function addEventListenerWithRetry<K extends keyof HTMLElementEventMap>(
  selector: string,
  eventType: K,
  callback: (event: HTMLElementEventMap[K]) => void,
  maxAttempts: number = 15,
  interval: number = 500,
): void {
  function tryAddListener(attempt: number = 0): void {
    const element = document.querySelector<HTMLElement>(selector);

    if (element) {
      element.addEventListener(eventType, callback);
      return;
    }

    if (attempt < maxAttempts) {
      setTimeout(() => {
        tryAddListener(attempt + 1);
      }, interval);
    }
  }

  tryAddListener();
}
