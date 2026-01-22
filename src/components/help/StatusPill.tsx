import React from 'react'

interface StatusPillProps {
  variant: 'available' | 'soon'
  label: string
}

export function StatusPill({ variant, label }: StatusPillProps) {
  const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"

  const variantClasses = {
    available: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900",
    soon: "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800"
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {variant === 'available' && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
      )}
      {label}
    </span>
  )
}
