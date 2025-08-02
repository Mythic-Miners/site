'use client';

import LogRocketProvider from '@/components/context/LogRocket';
import LayoutWrapper from '@/components/ui/LayoutWrapper';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <LogRocketProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </LogRocketProvider>
  );
}
