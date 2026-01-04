'use client'

import { useState, useEffect } from 'react'
import { defaultLocale, type Locale } from './locales'
import { translations, type Translation } from './translations'

// Browser-only translation system
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only run in browser
    if (typeof window === 'undefined') return
    
    // Load saved locale
    const saved = localStorage.getItem('locale') as Locale
    if (saved && saved in translations) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    if (typeof window === 'undefined') return
    
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // Always return English during SSR
  const currentLocale = mounted ? locale : defaultLocale
  const t = translations[currentLocale]

  return { t, locale: currentLocale, setLocale }
}