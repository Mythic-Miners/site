import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  detectLanguageFromHeaders,
  supportedLanguages,
} from '@/lib/i18n-server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // MAINTENANCE MODE: Allow only home pages, API routes, and static files
  
  // Check if it's a home page (e.g., /en, /pt, /es)
  const isHomePage = supportedLanguages.some(
    (lang) => pathname === `/${lang}` || pathname === `/${lang}/`,
  );

  // Allow home pages
  if (isHomePage) {
    return NextResponse.next();
  }

  // Allow API routes, static files, and Next.js internal files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // MAINTENANCE MODE: Redirect all other routes to home page
  
  // Extract language from pathname if it exists
  const pathLang = supportedLanguages.find((lang) =>
    pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
  );

  // Redirect /app/* to home
  if (
    pathname.startsWith('/pt/app/') ||
    pathname === '/pt/app' ||
    pathname.startsWith('/en/app/') ||
    pathname === '/en/app' ||
    pathname.startsWith('/es/app/') ||
    pathname === '/es/app' ||
    pathname === '/app'
  ) {
    const lang = pathname.startsWith('/pt') ? 'pt' : pathname.startsWith('/en') ? 'en' : 'pt';
    const newUrl = new URL(`/${lang}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // If path has a language prefix but is not home, redirect to home
  if (pathLang) {
    const newUrl = new URL(`/${pathLang}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // For paths without language prefix, detect language and redirect to home
  const acceptLanguage = request.headers.get('accept-language') || '';
  const detectedLanguage = detectLanguageFromHeaders(acceptLanguage);

  // Check for saved language preference in cookies
  const savedLanguage = request.cookies.get('preferred-language')?.value;
  const preferredLanguage =
    savedLanguage && supportedLanguages.includes(savedLanguage as any)
      ? savedLanguage
      : detectedLanguage;

  // Redirect to home page with language prefix
  const newUrl = new URL(`/${preferredLanguage}`, request.url);
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);

  // Set cookie for future visits
  response.cookies.set('preferred-language', preferredLanguage, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)',
  ],
};
