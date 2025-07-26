'use client';

import { Button } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/LanguageContext';

import { LanguageSwitcher } from '../LanguageSwitcher';
import AuthButton from './AuthButton';

export default function Header() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      name: t('airdrop.title'),
      href: `/${language}/airdrop`,
      current: pathname === `/${language}/airdrop`,
    },
    {
      name: t('inventory.title'),
      href: `/${language}/inventory`,
      current: pathname === `/${language}/inventory`,
    },
    {
      name: t('footer.quickLinks.game'),
      href: `/${language}/game`,
      current: pathname === `/${language}/game`,
    },
    {
      name: 'ICO',
      href: 'https://ico.mythicminers.com',
      current: false,
      external: true,
    },
    {
      name: t('footer.quickLinks.whitepaper'),
      href:
        language === 'pt'
          ? 'https://whitepaper.mythicminers.com/mythic-miners-whitepaper-pt-br'
          : 'https://whitepaper.mythicminers.com',
      current: false,
      external: true,
    },
  ];

  return (
    <header
      className={`backdrop-blur-md border-b-2 border-black shadow-[0_0_10px_0_rgb(0,0,0)] sticky top-0 z-50 ${
        isMenuOpen ? 'bg-indigo-950' : 'bg-indigo-950/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${language}`} className="flex items-center">
              <Image
                src="/assets/images/logo.webp"
                alt="Mythic Miners"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold text-yellow-50 font-ceaser mythic-text-shadow sm:block">
                Mythic Miners
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex lg:space-x-8 md:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                  item.current
                    ? 'text-yellow-50 bg-indigo-950/70 rounded-md'
                    : 'text-neutral-200 hover:text-neutral-100 hover:bg-indigo-950/40 rounded-md'
                }`}
              >
                <span className="mt-[3px] text-sm">{item.name}</span>
                {item.external && (
                  <svg
                    className="inline w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="https://www.instagram.com/mythicminers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                href="https://discord.gg/eRkSdbRCtn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="none"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </Link>
              <Link
                href="https://x.com/MythicMiners"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                  <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772" />
                </svg>
              </Link>
            </div>
            <LanguageSwitcher />

            <div className="hidden sm:block">
              <AuthButton header />
            </div>

            {/* Mobile menu button */}
            <Button
              isIconOnly
              variant="ghost"
              className="md:hidden text-black bg-indigo-900/70 border-2 border-black"
              onPress={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="h-screen md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    item.current
                      ? 'text-yellow-50 bg-indigo-200/20 rounded-md'
                      : 'text-neutral-200 hover:text-neutral-100 hover:bg-indigo-950/40 rounded-md'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.external && (
                    <svg
                      className="inline w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </Link>
              ))}
              <div className="px-2 py-2 [&>button]:w-full!">
                <AuthButton header />
              </div>

              {/* Mobile Social Media Icons */}
              <div className="px-2 py-2">
                <div className="flex justify-center space-x-4">
                  <Link
                    href="https://www.instagram.com/mythicminers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
                  >
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </Link>
                  <Link
                    href="https://discord.gg/eRkSdbRCtn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
                  >
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://x.com/MythicMiners"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-200 hover:text-yellow-50 hover:bg-indigo-950/40 rounded-md transition-colors duration-200"
                  >
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                      <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
