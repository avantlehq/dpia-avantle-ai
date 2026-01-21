// Client-side i18n utilities for DPIA Privacy Platform
// Only contains functions used by client components

import { Locale, defaultLocale, isValidLocale, localeStorageKey, localeCookieName } from './config'

/**
 * Detect client-side locale from localStorage, cookies, or browser language
 * Used by: useClientLocale hook, modules state
 */
export function detectClientLocale(): Locale {
  // Check localStorage first
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(localeStorageKey)
      if (stored && isValidLocale(stored)) {
        return stored
      }
    } catch {
      // Ignore storage errors
    }
  }

  // Check cookie
  if (typeof document !== 'undefined') {
    try {
      const cookies = document.cookie.split(';')
      const localeCookie = cookies.find(cookie =>
        cookie.trim().startsWith(`${localeCookieName}=`)
      )

      if (localeCookie) {
        const locale = localeCookie.split('=')[1]?.trim()
        if (locale && isValidLocale(locale)) {
          return locale
        }
      }
    } catch {
      // Ignore cookie errors
    }
  }

  // Check browser language
  if (typeof navigator !== 'undefined') {
    try {
      const browserLang = navigator.language.split('-')[0]
      if (isValidLocale(browserLang)) {
        return browserLang
      }
    } catch {
      // Ignore navigator errors
    }
  }

  return defaultLocale
}

/**
 * Set client-side locale with persistence to localStorage and cookies
 * Used by: useClientLocale hook, language switcher
 */
export function setClientLocale(locale: Locale): void {
  if (!isValidLocale(locale)) {
    console.warn(`Invalid locale: ${locale}`)
    return
  }

  // Update localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(localeStorageKey, locale)
    } catch {
      // Ignore storage errors
    }
  }

  // Update cookie
  if (typeof document !== 'undefined') {
    try {
      const maxAge = 60 * 60 * 24 * 365 // 1 year
      document.cookie = `${localeCookieName}=${locale}; Max-Age=${maxAge}; Path=/; SameSite=Strict`
    } catch {
      // Ignore cookie errors
    }
  }
}
