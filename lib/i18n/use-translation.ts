'use client'

import { useState, useEffect } from 'react'
import { defaultLocale, type Locale } from './locales'
import { translations, type Translation } from './translations'

// Custom hook for translations
export function useTranslation(): { t: Translation; locale: Locale; setLocale: (locale: Locale) => void } {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Load locale from localStorage on mount
    const saved = localStorage.getItem('locale') as Locale
    if (saved && translations[saved]) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = translations[locale]

  return { t, locale, setLocale }
}