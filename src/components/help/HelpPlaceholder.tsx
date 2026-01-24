'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'
import { useClientLocale } from '@/hooks/useClientLocale'

interface HelpPlaceholderProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function HelpPlaceholder({ title, description, icon }: HelpPlaceholderProps) {
  const { locale } = useClientLocale()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            {icon}
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Link href={`/${locale}/help`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Button>
        </Link>
      </div>

      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Clock className="h-5 w-5 text-orange-500" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This help section is currently being prepared. We&apos;re building comprehensive documentation for privacy professionals.
          </p>
          <p className="text-sm text-muted-foreground">
            Expected availability: Q2 2026
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
