'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MaintenanceBlock() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isConnected } = useAuth();

  useEffect(() => {
    // Logout user in maintenance mode
    if (isConnected) {
      logout();
    }
  }, [isConnected, logout]);

  useEffect(() => {
    // Extract language from current pathname
    const lang = pathname?.split('/')[1] || 'en';
    const homePath = `/${lang}`;

    // Intercept link clicks to prevent navigation away from home
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const isHomePage = url.pathname === homePath || url.pathname === `${homePath}/`;
          const isExternal = link.href.startsWith('http') && !link.href.includes(window.location.hostname);
          const isNewTab = link.target === '_blank' || link.hasAttribute('target');
          
          // Allow external links and links that open in new tabs
          // Block internal navigation that's not to home page
          if (!isHomePage && !isExternal && !isNewTab && url.hostname === window.location.hostname) {
            e.preventDefault();
            e.stopPropagation();
            router.replace(homePath);
          }
        } catch (error) {
          // If URL parsing fails, check if it's a relative path
          if (link.href.startsWith('/')) {
            const hrefPath = link.href.split('?')[0]; // Remove query params
            const isHomePage = hrefPath === homePath || hrefPath === `${homePath}/`;
            if (!isHomePage && !link.target) {
              e.preventDefault();
              e.stopPropagation();
              router.replace(homePath);
            }
          }
        }
      }
    };

    // Also listen for browser back/forward and redirect to home
    const handlePopState = () => {
      const currentLang = pathname?.split('/')[1] || 'en';
      const isHomePage = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
      if (!isHomePage) {
        router.replace(`/${currentLang}`);
      }
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, pathname]);

  return null;
}

