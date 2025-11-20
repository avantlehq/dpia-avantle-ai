import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Only apply i18n to dashboard routes, exclude public landing pages
  matcher: [
    // Include only locale-specific dashboard routes
    '/(de|en|sk)/(dashboard|auth)/:path*',
    '/(de|en|sk)/dashboard',
    '/(de|en|sk)/auth'
  ]
}