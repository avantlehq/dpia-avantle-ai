'use client'

import React from 'react'
import { NavItem } from './nav-item'
import { type NavGroup as NavGroupType } from '@/lib/state/navigation'

interface NavGroupProps {
  group: NavGroupType
  collapsed?: boolean
  activePath?: string
  onItemClick?: () => void
}

export function NavGroup({ group, collapsed = false, activePath, onItemClick }: NavGroupProps) {
  if (collapsed) {
    // Collapsed view - show icons only
    return (
      <div className="space-y-1">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={true}
            active={activePath === item.href || activePath?.startsWith(item.href + '/')}
            onClick={onItemClick}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Modern flat design - no group headers for clean aesthetic */}
      {group.name && (
        <div className="px-2 mb-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {group.name}
          </h3>
        </div>
      )}

      {/* Group Items with generous spacing */}
      <div className="space-y-1">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={false}
            active={activePath === item.href || activePath?.startsWith(item.href + '/')}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  )
}