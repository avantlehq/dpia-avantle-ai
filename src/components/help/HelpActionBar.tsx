import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Play, Mail } from 'lucide-react'

interface HelpActionBarProps {
  locale: string
  searchValue: string
  onSearchChange: (value: string) => void
  labels: {
    backToDashboard: string
    searchPlaceholder: string
    gettingStarted: string
    contactSupport: string
    sectionBeingPrepared: string
  }
}

export function HelpActionBar({
  locale,
  searchValue,
  onSearchChange,
  labels
}: HelpActionBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Back to Dashboard */}
      <div className="flex-shrink-0">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {labels.backToDashboard}
          </Button>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:flex-initial sm:justify-end">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            type="search"
            placeholder={labels.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
            aria-label={labels.searchPlaceholder}
          />
        </div>

        {/* Getting Started Button */}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-2 opacity-60 cursor-not-allowed whitespace-nowrap"
          title={labels.sectionBeingPrepared}
        >
          <Play className="h-4 w-4" />
          {labels.gettingStarted}
        </Button>

        {/* Contact Support Button */}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-2 opacity-60 cursor-not-allowed whitespace-nowrap"
          title={labels.sectionBeingPrepared}
        >
          <Mail className="h-4 w-4" />
          {labels.contactSupport}
        </Button>
      </div>
    </div>
  )
}
