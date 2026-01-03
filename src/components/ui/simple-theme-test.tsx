'use client'

import { Button } from '@/components/ui/button'

export function SimpleThemeTest() {
  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      html.classList.add('light')
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
    }
  }

  return (
    <Button 
      onClick={toggleTheme}
      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
    >
      Toggle Theme
    </Button>
  )
}