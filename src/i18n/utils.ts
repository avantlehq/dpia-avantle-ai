// i18n utilities for DPIA Privacy Platform
// Provides translation functions until next-intl is fully integrated

import { Locale, defaultLocale, isValidLocale } from './config'

// Type for translation dictionaries
export type TranslationDictionary = Record<string, unknown>

// Cache for loaded dictionaries
const dictionaryCache = new Map<Locale, TranslationDictionary>()

// Load translation dictionary
export async function loadDictionary(locale: Locale): Promise<TranslationDictionary> {
  // Check cache first
  if (dictionaryCache.has(locale)) {
    return dictionaryCache.get(locale)!
  }
  
  try {
    // Dynamic import of translation files
    const dictionary = await import(`./dictionaries/${locale}.json`)
    const data = dictionary.default || dictionary
    
    // Cache the dictionary
    dictionaryCache.set(locale, data)
    return data
  } catch {
    console.warn(`Failed to load dictionary for locale ${locale}, falling back to default`)
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      return loadDictionary(defaultLocale)
    }
    
    // If even default fails, return empty dictionary
    return {}
  }
}

// Get nested value from object using dot notation
export function getNestedValue(obj: unknown, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
  }, obj) as string | undefined
}

// Translation function with interpolation support
export function translate(
  dictionary: TranslationDictionary,
  key: string,
  variables?: Record<string, string | number>
): string {
  const value = getNestedValue(dictionary, key)
  
  if (typeof value !== 'string') {
    console.warn(`Translation key "${key}" not found or is not a string`)
    return key // Return the key itself as fallback
  }
  
  // Simple variable interpolation
  if (variables) {
    return Object.entries(variables).reduce((text, [varKey, varValue]) => {
      return text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue))
    }, value)
  }
  
  return value
}

// Plural translation function (basic implementation)
export function translatePlural(
  dictionary: TranslationDictionary,
  key: string,
  count: number,
  variables?: Record<string, string | number>
): string {
  const pluralKey = count === 1 ? `${key}.one` : `${key}.other`
  const fallbackKey = key
  
  let value = getNestedValue(dictionary, pluralKey)
  if (typeof value !== 'string') {
    value = getNestedValue(dictionary, fallbackKey)
  }
  
  if (typeof value !== 'string') {
    console.warn(`Plural translation key "${key}" not found`)
    return `${key} (${count})`
  }
  
  // Include count in variables
  const allVariables = { count, ...variables }
  
  return Object.entries(allVariables).reduce((text, [varKey, varValue]) => {
    return text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue))
  }, value)
}

// Create translation context (similar to next-intl's useTranslations)
export function createTranslationContext(dictionary: TranslationDictionary, namespace?: string) {
  const baseDict = namespace ? getNestedValue(dictionary, namespace) : dictionary
  
  if (!baseDict || typeof baseDict !== 'object') {
    console.warn(`Translation namespace "${namespace}" not found`)
    return {
      t: () => '',
      tPlural: () => '',
      has: () => false,
      raw: () => undefined
    }
  }
  
  return {
    t: (key: string, variables?: Record<string, string | number>) => {
      return translate(baseDict, key, variables)
    },
    
    tPlural: (key: string, count: number, variables?: Record<string, string | number>) => {
      return translatePlural(baseDict, key, count, variables)
    },
    
    // Check if key exists
    has: (key: string) => {
      return typeof getNestedValue(baseDict, key) === 'string'
    },
    
    // Get raw value (for complex objects)
    raw: (key: string) => {
      return getNestedValue(baseDict, key)
    }
  }
}

// Format date using locale
export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch {
    return date.toLocaleDateString()
  }
}

// Format number using locale
export function formatNumber(number: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(locale, options).format(number)
  } catch {
    return number.toString()
  }
}

// Client-side locale detection
export function detectClientLocale(): Locale {
  // Check localStorage first
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('privacy-platform-locale')
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
        cookie.trim().startsWith('PRIVACY_PLATFORM_LOCALE=')
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
    const browserLang = navigator.language.split('-')[0]
    if (isValidLocale(browserLang)) {
      return browserLang
    }
  }
  
  return defaultLocale
}

// Set client locale with persistence
export function setClientLocale(locale: Locale): void {
  if (!isValidLocale(locale)) {
    console.warn(`Invalid locale: ${locale}`)
    return
  }
  
  // Update localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('privacy-platform-locale', locale)
    } catch {
      // Ignore storage errors
    }
  }
  
  // Update cookie
  if (typeof document !== 'undefined') {
    try {
      document.cookie = `PRIVACY_PLATFORM_LOCALE=${locale}; Max-Age=31536000; Path=/; SameSite=Strict`
    } catch {
      // Ignore cookie errors
    }
  }
}