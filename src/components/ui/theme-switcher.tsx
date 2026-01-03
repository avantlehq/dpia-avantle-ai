'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
    // Set default theme to dark if no theme is set
    if (!theme) {
      setTheme('dark')
    }
  }, [theme, setTheme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 p-0"
        disabled
      >
        <Moon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-9 w-9 p-0"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}