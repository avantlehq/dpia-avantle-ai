import React from 'react'

interface StatItem {
  label: string
  value: number | string
}

interface HelpStatsProps {
  stats: StatItem[]
}

export function HelpStats({ stats }: HelpStatsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-[var(--surface-1)] border border-[var(--border-default)] rounded-lg"
        >
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {stat.label}
          </span>
          <span className="text-lg font-semibold text-[var(--text-primary)]">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}
