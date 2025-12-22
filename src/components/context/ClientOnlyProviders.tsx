'use client';

import dynamic from 'next/dynamic';

const ClientProviders = dynamic(
  () => import('@/components/context/ClientProviders').then((mod) => mod.ClientProviders),
  { ssr: false }
);

export function ClientOnlyProviders({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
