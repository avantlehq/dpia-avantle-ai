import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusPill } from './StatusPill'

interface HelpSectionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  available: boolean
  url?: string
  locale: string
  availableLabel: string
  soonLabel: string
  browseLabel: string
  comingSoonLabel: string
}

export function HelpSectionCard({
  icon,
  title,
  description,
  available,
  url,
  locale,
  availableLabel,
  soonLabel,
  browseLabel,
  comingSoonLabel
}: HelpSectionCardProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-[var(--surface-1)] border border-[var(--border-default)] rounded-lg hover:border-[var(--border-hover)] transition-colors">
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header with title and status */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
            {title}
          </h3>
          <StatusPill
            variant={available ? 'available' : 'soon'}
            label={available ? availableLabel : soonLabel}
          />
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>

        {/* CTA Button */}
        <div className="pt-1">
          {available && url ? (
            <Link href={`/${locale}${url}`}>
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
              >
                {browseLabel}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              {comingSoonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
