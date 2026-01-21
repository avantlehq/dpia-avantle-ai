// i18n configuration for DPIA Privacy Platform
// Prepared for next-intl integration

export const locales = ['en', 'sk'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

// Language display names
export const languageNames: Record<Locale, string> = {
  en: 'English',
  sk: 'Slovenčina'
}

// Language display names in their native language
export const nativeLanguageNames: Record<Locale, string> = {
  en: 'English',
  sk: 'Slovenčina'
}

// RTL languages (none currently, but prepared for future)
export const rtlLocales: Locale[] = []

// Locale detection priority
export const localeDetectionOrder: ('header' | 'cookie' | 'storage' | 'default')[] = [
  'cookie',     // First check cookie
  'storage',    // Then localStorage
  'header',     // Then browser language
  'default'     // Finally fallback
]

// Cookie configuration
export const localeCookieName = 'PRIVACY_PLATFORM_LOCALE'
export const localeCookieMaxAge = 60 * 60 * 24 * 365 // 1 year

// Storage configuration
export const localeStorageKey = 'privacy-platform-locale'

// Helper: Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// URL path configuration for next-intl
export const pathnames = {
  // Common paths
  '/': '/',
  '/dashboard': '/dashboard',
  '/privacy': '/privacy',

  // DPIA paths
  '/assessments/new': {
    en: '/assessments/new',
    sk: '/hodnotenia/nove'
  },
  '/assessments/[id]': {
    en: '/assessments/[id]',
    sk: '/hodnotenia/[id]'
  }
} as const

export type Pathnames = typeof pathnames
export type LocalePrefix = 'always' | 'as-needed' | 'never'

// Locale prefix strategy
export const localePrefix: LocalePrefix = 'always'
