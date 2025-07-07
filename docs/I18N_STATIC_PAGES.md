# Internationalization (i18n) Static Pages

This document explains how to use the server-side rendered static pages with internationalization support using [lang] parameters.

## Overview

The i18n static pages system provides:
- **Automatic URL localization** via middleware
- **Server-side rendering** for better SEO
- **Static generation** for better performance
- **URL-based language switching** (`/en/static`, `/pt/static`)
- **Cookie-based language persistence**
- **Type-safe translations**

## File Structure

```
src/
├── middleware.ts               # Automatic URL localization middleware
├── lib/
│   ├── i18n-server.ts          # Server-side i18n utilities
│   └── i18n-client.ts          # Client-side i18n utilities
├── types/
│   └── i18n.ts                 # TypeScript type definitions
├── components/
│   └── ClientLanguageRedirect.tsx # Client-side language redirect component
├── app/
│   └── [lang]/
│       ├── layout.tsx          # Language-specific layout with full app context
│       ├── not-found.tsx       # 404 page for invalid languages
│       └── static/
│           └── page.tsx        # Main static page
```

## Usage

### Accessing the Static Pages

- **Any URL without language**: Automatically redirected to language-specific URL
  - `/` → `/en/` or `/pt/` (based on user preference)
  - `/static` → `/en/static` or `/pt/static`
  - `/about` → `/en/about` or `/pt/about`
- **Direct language URLs**: 
  - **English**: `/en/static`
  - **Portuguese**: `/pt/static`

### Automatic URL Localization

The middleware automatically adds language prefixes to all URLs:

```typescript
// middleware.ts handles these redirects automatically:
'/' → '/en/' or '/pt/'
'/about' → '/en/about' or '/pt/about'
'/static' → '/en/static' or '/pt/static'
```

**Detection Priority:**
1. **Cookie preference** (set by previous visits)
2. **Accept-Language header** (browser settings)
3. **Default fallback** (English)

**What's excluded:**
- API routes (`/api/*`)
- Static assets (`/assets/*`, `/_next/*`)
- Already localized URLs (`/en/*`, `/pt/*`)

### Server-Side Translation Functions

```typescript
import { getTranslation, getTranslations } from '@/lib/i18n-server';

// Get a specific translation
const title = getTranslation(lang, 'hero.title');

// Get translation with parameters
const bonus = getTranslation(lang, 'tokenPurchase.bonus.description', { bonus: '20' });

// Get all translations for a language
const translations = getTranslations(lang);
```

### Creating New Static Pages

Create your page in `src/app/[lang]/your-page/page.tsx`:

```typescript
import { getTranslation, generateStaticParams as getStaticParams } from '@/lib/i18n-server';

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function YourPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  return (
    <div>
      <h1>{getTranslation(lang, 'your.translation.key')}</h1>
    </div>
  );
}
```

## Features

### 1. Automatic URL Localization
- **Middleware-powered**: Automatically adds language prefixes to all URLs
- **Cookie persistence**: Remembers user language preference across sessions
- **Smart detection**: Cookies → Accept-Language → Default fallback
- **Performance optimized**: Excludes static assets and API routes

### 2. SEO Optimization
- Proper HTML lang attributes
- Language-specific metadata
- OpenGraph tags for social media

### 3. Static Generation
- Pre-rendered at build time for all supported languages
- Optimal performance with Next.js static generation
- CDN-friendly caching

### 4. Type Safety
- TypeScript definitions for translation keys
- Autocomplete for translation paths
- Compile-time checking for translation keys

## Adding New Languages

1. Create the translation file in `src/locales/[lang].json`
2. Update the `supportedLanguages` array in `src/lib/i18n-server.ts`:

```typescript
export const supportedLanguages = ['en', 'pt', 'es'] as const;
```

3. Add the translations to the `translations` object:

```typescript
import esTranslations from '@/locales/es.json';

const translations = {
  en: enTranslations,
  pt: ptTranslations,
  es: esTranslations,
} as const;
```

## Best Practices

1. **Use TypeScript**: The system provides full type safety for translation keys
2. **Nested translations**: Organize translations in logical groups (e.g., `common.welcome`)
3. **Parameter interpolation**: Use `{{variable}}` syntax for dynamic content
4. **Fallback handling**: Always provide English translations as fallback

## Example Translation Structure

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading..."
  },
  "hero": {
    "title": "My App Title",
    "description": "Welcome to {{appName}} - the best app ever!"
  }
}
``` 