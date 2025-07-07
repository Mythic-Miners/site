import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  detectLanguageFromHeaders,
  supportedLanguages,
} from '@/lib/i18n-server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path already has a language prefix
  const hasLanguagePrefix = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
  );

  // Skip middleware for:
  // - Already prefixed paths
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Next.js internal files
  if (
    hasLanguagePrefix ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Detect user's preferred language
  const acceptLanguage = request.headers.get('accept-language') || '';
  const detectedLanguage = detectLanguageFromHeaders(acceptLanguage);

  // Check for saved language preference in cookies
  const savedLanguage = request.cookies.get('preferred-language')?.value;
  const preferredLanguage =
    savedLanguage && supportedLanguages.includes(savedLanguage as any)
      ? savedLanguage
      : detectedLanguage;

  // Create the new URL with language prefix
  const newUrl = new URL(`/${preferredLanguage}${pathname}`, request.url);

  // Copy search parameters
  newUrl.search = request.nextUrl.search;

  // Redirect to the language-prefixed URL
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
