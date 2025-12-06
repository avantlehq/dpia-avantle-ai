'use client'

export const dynamic = 'force-dynamic'

import { ThemeProvider } from './theme-provider'

export function ClientThemeProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}