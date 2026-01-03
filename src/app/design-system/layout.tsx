import { ThemeProvider } from '@/components/providers/theme-provider'
import '../globals.css'

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-[--background] text-[--text-primary]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}