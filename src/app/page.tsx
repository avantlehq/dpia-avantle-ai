import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function Home() {
  // Get the accepted language from headers for initial locale detection
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  
  // Simple locale detection - check if Slovak is preferred
  const prefersSlovak = acceptLanguage?.includes('sk') || acceptLanguage?.includes('SK')
  const locale = prefersSlovak ? 'sk' : 'en'
  
  // Redirect to Privacy Overview with detected locale
  redirect(`/${locale}/privacy`)
}
