import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '../lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Avantle.ai — Platform for Secure AI Agents',
  description: 'Privacy by Design. One core that powers infinite local agents.',
  openGraph: {
    title: 'Avantle.ai — Platform for Secure AI Agents',
    description: 'Privacy by Design. One core that powers infinite local agents.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avantle.ai — Platform for Secure AI Agents',
    description: 'Privacy by Design. One core that powers infinite local agents.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        {children}
      </body>
    </html>
  )
}