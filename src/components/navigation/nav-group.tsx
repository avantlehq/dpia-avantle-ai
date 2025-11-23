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
            className={
              group.colorClass === 'dpia-green' ? 'w-2 h-2 rounded-full bg-dpia-green' :
              group.colorClass === 'dpia-orange' ? 'w-2 h-2 rounded-full bg-dpia-orange' :
              group.colorClass === 'dpia-red' ? 'w-2 h-2 rounded-full bg-dpia-red' :
              group.colorClass === 'dpia-purple' ? 'w-2 h-2 rounded-full bg-dpia-purple' :
              'w-2 h-2 rounded-full bg-dpia-blue'
            }
          />
          <h3 
            className={`text-xs font-semibold uppercase tracking-wider ${
              group.colorClass === 'dpia-green' ? 'text-green-400' :
              group.colorClass === 'dpia-orange' ? 'text-orange-400' :
              group.colorClass === 'dpia-red' ? 'text-red-400' :
              group.colorClass === 'dpia-purple' ? 'text-purple-400' :
              'text-blue-400'
            }`}
          >
            {group.name}
          </h3>
        </div>
        <div 
          className={
            group.colorClass === 'dpia-green' ? 'mt-1 h-0.5 rounded-full opacity-30 bg-dpia-green' :
            group.colorClass === 'dpia-orange' ? 'mt-1 h-0.5 rounded-full opacity-30 bg-dpia-orange' :
            group.colorClass === 'dpia-red' ? 'mt-1 h-0.5 rounded-full opacity-30 bg-dpia-red' :
            group.colorClass === 'dpia-purple' ? 'mt-1 h-0.5 rounded-full opacity-30 bg-dpia-purple' :
            'mt-1 h-0.5 rounded-full opacity-30 bg-dpia-blue'
          }
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