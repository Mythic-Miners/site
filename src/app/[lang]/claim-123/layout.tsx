'use client';

import LayoutWrapper from '@/components/ui/LayoutWrapper';

interface ClaimLayoutProps {
  children: React.ReactNode;
}

export default function ClaimLayout({ children }: ClaimLayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
