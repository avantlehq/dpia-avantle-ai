'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, type NavItem } from '@/lib/state/modules'

interface ModernSidebarProps {
  className?: string
}

// Fixed sidebar nav row - no link styling, proper nav appearance
interface SidebarLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function SidebarLink({ item, isActive, collapsed }: SidebarLinkProps) {
  const isDisabled = item.disabled
  
  const navRowContent = (
    <div 
      className="group relative flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 focus-within:outline-none"
      style={{
        backgroundColor: 'transparent', // Clean professional background
        borderLeft: isActive ? '2px solid #60a5fa' : 'none', // Blue accent when active
        color: isActive ? '#ffffff' : '#9ca3af', // White text if active, gray if inactive
        paddingLeft: isActive ? '11px' : '12px', // Compensate for border width
        paddingRight: '20px' // Add right padding to prevent text touching border
      }}
    >
      {/* Clean text-only navigation - NO ICONS anywhere */}
      {!collapsed && (
        <span 
          className="truncate select-none"
          style={{
            fontWeight: isActive ? '600' : '400', // Semibold if active
            color: 'inherit' // Inherit from parent div
          }}
        >{item.name}</span>
      )}
      
      {/* When collapsed, show first letter - NO ICONS */}
      {collapsed && (
        <span 
          className="text-xs font-medium text-center w-full"
          style={{
            color: isActive ? '#60a5fa' : '#6b7280'
          }}
        >
          {item.name.charAt(0).toUpperCase()}
        </span>
      )}
      
      {/* Collapsed tooltip - shows full name when hovering over letter */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {item.name}
          {isDisabled && " - Coming soon"}
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <div className="group relative" title={`${item.name} - Coming soon`}>
        {navRowContent}
      </div>
    )
  }

  return (
    <Link 
      href={item.href}
      className="group relative block modern-nav-link"
      aria-current={isActive ? "page" : undefined}
    >
      {navRowContent}
    </Link>
  )
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const activeModuleId = getActiveModule(pathname)
  const moduleConfig = getModuleConfig(activeModuleId || 'privacy')

  // Find active item within current module
  const activeItemId = moduleConfig?.items.find(item => 
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.id



  return (
    <aside className={cn(
      "flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Fixed HOME Header - Does not change with module switching */}
      <div className="px-4 py-4 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              {/* Fixed HOME header - same size as topbar modules */}
              <h2 className="font-medium text-white text-sm">
                HOME
              </h2>
            </div>
          )}
          
          {collapsed && (
            <div className="flex justify-center w-full">
              <span className="text-sm font-semibold text-blue-400">H</span>
            </div>
          )}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-8 w-8 p-0 text-white hover:text-white hover:bg-white/10",
              "border-none bg-transparent flex-shrink-0",
              collapsed && "w-full justify-center"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Items - Increased vertical spacing */}
      <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-label="Module navigation">
        {moduleConfig?.items.map((item) => {
          const isActive = activeItemId === item.id
          return (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
            />
          )
        })}
      </nav>

    </aside>
  )
}