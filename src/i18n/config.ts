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
  '/assessments/pre-check': {
    en: '/assessments/pre-check', 
    sk: '/hodnotenia/kontrola'
  },
  '/assessments/builder': {
    en: '/assessments/builder',
    sk: '/hodnotenia/tvorca'
  },
  '/settings': {
    en: '/settings',
    sk: '/nastavenia'
  }
} as const

export type Pathnames = typeof pathnames

// Date/time formatting configuration
export const dateTimeFormats = {
  en: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    datetime: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  },
  sk: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    datetime: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  }
} as const

// Number formatting configuration
export const numberFormats = {
  en: {
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    },
    currency: {
      style: 'currency',
      currency: 'EUR'
    }
  },
  sk: {
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    },
    currency: {
      style: 'currency',
      currency: 'EUR'
    }
  }
} as const

// Validation for locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get locale from string with fallback
export function getValidLocale(locale?: string | null): Locale {
  if (locale && isValidLocale(locale)) {
    return locale
  }
  return defaultLocale
}

// Browser language detection
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale
  
  const browserLang = navigator.language.split('-')[0]
  return isValidLocale(browserLang) ? browserLang : defaultLocale
}

// Storage helpers
export function getStoredLocale(): Locale | null {
  if (typeof localStorage === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(localeStorageKey)
    return stored && isValidLocale(stored) ? stored : null
  } catch {
    return null
  }
}

export function setStoredLocale(locale: Locale): void {
  if (typeof localStorage === 'undefined') return
  
  try {
    localStorage.setItem(localeStorageKey, locale)
  } catch {
    // Ignore storage errors
  }
}

// Cookie helpers (for server-side usage)
export function getLocaleCookieString(locale: Locale): string {
  return `${localeCookieName}=${locale}; Max-Age=${localeCookieMaxAge}; Path=/; SameSite=Strict`
}