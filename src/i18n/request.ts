import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

// Force dictionary reload - v3.31.4 cache bust for integrations translations
// Updated: 2026-01-20 - Added integrations module translations

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = defaultLocale;
  }

  // RENAMED FILES: en.json → en-v2.json, sk.json → sk-v2.json (v3.31.7)
  // Forces completely new import paths to bypass all webpack/Vercel cache
  console.log('[i18n/request] Loading dictionary v2 for locale:', locale)

  return {
    locale,
    messages: (await import(`./dictionaries/${locale}-v2.json`)).default
  };
});