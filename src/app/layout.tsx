import './globals.css';

import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import localFont from 'next/font/local';

import { HeroUIProvider } from '@/components/context/HeroUI';
import LogRocketProvider from '@/components/context/LogRocket';
import QueryProvider from '@/components/context/QueryProvider';
import { ThirdwebProvider } from '@/components/context/Thirdweb';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

const ceaserfont = localFont({
  src: '../fonts/CaesarDressing-Regular.ttf',
  variable: '--font-ceaser',
  display: 'auto',
});
const senFont = Sen({ variable: '--font-sen', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mythic Miners: Unearth Your Fortune',
  description:
    'Dive into the mystical world of Mythic Miners, a Web 3 game where you explore caves, mine rocks, upgrade your miner, trade NFTs, and win real money. Start your adventure now!',
  openGraph: {
    title: 'Mythic Miners: Unearth Your Fortune',
    description:
      'Dive into the mystical world of Mythic Miners, a Web 3 game where you explore caves, mine rocks, upgrade your miner, trade NFTs, and win real money. Start your adventure now!',
    images: [{ url: '' }],
  },
  metadataBase: new URL('https://mythicminers.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
