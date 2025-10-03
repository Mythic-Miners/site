'use client';

import LayoutWrapper from '@/components/ui/LayoutWrapper';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
