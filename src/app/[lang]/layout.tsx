import '@/app/globals.css';

import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { ThirdwebProvider } from 'thirdweb/react';

import { HeroUIProvider } from '@/components/context/HeroUI';
import LogRocketProvider from '@/components/context/LogRocket';
import QueryProvider from '@/components/context/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import type { SupportedLanguage } from '@/lib/i18n-server';
import { getTranslation, supportedLanguages } from '@/lib/i18n-server';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

const ceaserfont = localFont({
  src: '../../fonts/CaesarDressing-Regular.ttf',
  variable: '--font-ceaser',
  display: 'auto',
});
const senFont = Sen({ variable: '--font-sen', subsets: ['latin'] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Validate language
  if (!supportedLanguages.includes(lang as SupportedLanguage)) {
    notFound();
  }

  return {
    title: getTranslation(lang, 'metadata.title'),
    description: getTranslation(lang, 'metadata.description'),
    openGraph: {
      title: getTranslation(lang, 'metadata.title'),
      description: getTranslation(lang, 'metadata.description'),
      images: [{ url: '' }],
    },
    metadataBase: new URL('https://mythicminers.com'),
  };
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  // Validate language
  if (!supportedLanguages.includes(lang as SupportedLanguage)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <body className={`${ceaserfont.variable} ${senFont.className}`}>
        <ThirdwebProvider>
          <QueryProvider>
            <AuthProvider>
              <LanguageProvider>
                <LogRocketProvider>
                  <HeroUIProvider>{children}</HeroUIProvider>
                </LogRocketProvider>
              </LanguageProvider>
            </AuthProvider>
          </QueryProvider>
        </ThirdwebProvider>
        <div id="tsparticles" style={{ pointerEvents: 'none' }} />
      </body>
    </html>
  );
}
