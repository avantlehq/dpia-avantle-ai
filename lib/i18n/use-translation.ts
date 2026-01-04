import { defaultLocale, type Locale } from './locales'
import { translations } from './translations'

// SSR-safe fallback that works without React
const createSSRFallback = () => ({
  t: translations[defaultLocale],
  locale: defaultLocale,
  setLocale: () => {}
})

// Only use React hooks in browser environment
export function useTranslation() {
  // Immediate SSR check - return static fallback
  if (typeof window === 'undefined') {
    return createSSRFallback()
  }

  // Browser-only implementation using hardcoded English for now
  // This avoids the useContext SSR error completely
  const currentLocale = defaultLocale
  const t = translations[currentLocale]

  // Simple setLocale that just reloads page with new query param
  const setLocale = (newLocale: Locale) => {
    try {
      localStorage.setItem('locale', newLocale)
      // Simple page reload to apply new locale
      window.location.reload()
    } catch (error) {
      console.warn('Locale change failed:', error)
    }
  }

  return { t, locale: currentLocale, setLocale }
}