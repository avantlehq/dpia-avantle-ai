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
    <div className="space-y-3">
      {/* Group Title - Modern Colorful Header with CSS Variables */}
      <div className="px-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: 
                group.colorClass === 'dpia-green' ? 'var(--color-green)' :
                group.colorClass === 'dpia-orange' ? 'var(--color-orange)' :
                group.colorClass === 'dpia-red' ? 'var(--color-red)' :
                group.colorClass === 'dpia-purple' ? 'var(--color-purple)' :
                'var(--color-blue)'
            }}
          />
          <h3 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ 
              color: 
                group.colorClass === 'dpia-green' ? 'var(--color-green-light)' :
                group.colorClass === 'dpia-orange' ? 'var(--color-orange-light)' :
                group.colorClass === 'dpia-red' ? 'var(--color-red-light)' :
                group.colorClass === 'dpia-purple' ? 'var(--color-purple-light)' :
                'var(--color-blue-light)'
            }}
          >
            {group.name}
          </h3>
        </div>
        <div 
          className="mt-1 h-0.5 rounded-full opacity-30"
          style={{ 
            backgroundColor: 
              group.colorClass === 'dpia-green' ? 'var(--color-green)' :
              group.colorClass === 'dpia-orange' ? 'var(--color-orange)' :
              group.colorClass === 'dpia-red' ? 'var(--color-red)' :
              group.colorClass === 'dpia-purple' ? 'var(--color-purple)' :
              'var(--color-blue)'
          }}
        />
      </div>

      {/* Group Items */}
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