import '@/app/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { ThirdwebProvider } from 'thirdweb/react';

import { HeroUIProvider } from '@/components/context/HeroUI';
import QueryProvider from '@/components/context/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import UsernameGate from '@/components/ui/UsernameGate';
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
      <head>
        <meta name="facebook-domain-verification" content="26qgow5y3tec540v8n4mda3lrto40s" />
      </head>
      <body className={`${ceaserfont.variable} ${senFont.className}`}>
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
        <div id="tsparticles" style={{ pointerEvents: 'none' }} />
        <Script
          id="watson-assistant-chat"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.watsonAssistantChatOptions = {
                integrationID: "36636c81-169a-41f9-a38c-737836a680b2",
                region: "us-south",
                serviceInstanceID: "b5007c1b-a3ae-45c0-8864-c48e9008b277",
                onLoad: async (instance) => { await instance.render(); }
              };
              setTimeout(function(){
                const t=document.createElement('script');
                t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
                document.head.appendChild(t);
              });
            `,
          }}
        />
      </body>
      <GoogleAnalytics gaId="G-L1MYJR2KXB" />
    </html>
  );
}
