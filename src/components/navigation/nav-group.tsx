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
      {/* Group Title - Enhanced Modern Header with Better Visibility */}
      <div className="px-2 py-1">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full shadow-sm"
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
            className="text-sm font-bold uppercase tracking-wide"
            style={{ 
              color: 
                group.colorClass === 'dpia-green' ? 'var(--color-green)' :
                group.colorClass === 'dpia-orange' ? 'var(--color-orange)' :
                group.colorClass === 'dpia-red' ? 'var(--color-red)' :
                group.colorClass === 'dpia-purple' ? 'var(--color-purple)' :
                'var(--color-blue)',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            {group.name}
          </h3>
        </div>
        <div 
          className="mt-2 h-1 rounded-full"
          style={{ 
            backgroundColor: 
              group.colorClass === 'dpia-green' ? 'var(--color-green)' :
              group.colorClass === 'dpia-orange' ? 'var(--color-orange)' :
              group.colorClass === 'dpia-red' ? 'var(--color-red)' :
              group.colorClass === 'dpia-purple' ? 'var(--color-purple)' :
              'var(--color-blue)',
            opacity: '0.4'
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