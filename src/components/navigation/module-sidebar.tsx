'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getModuleConfig, type NavItem } from '@/lib/state/modules'

interface ModuleSidebarProps {
  activeModule: string
  collapsed?: boolean
  onItemClick?: () => void
}

interface ModuleNavItemProps {
  item: NavItem
  active: boolean
  collapsed?: boolean
  moduleColor: string
  onClick?: () => void
}

function ModuleNavItem({ 
  item, 
  active, 
  collapsed = false, 
  moduleColor,
  onClick 
}: ModuleNavItemProps) {
  if (item.disabled) {
    return (
      <div
        onClick={onClick}
        className="block w-full cursor-not-allowed"
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 transition-all duration-200",
            "text-sm font-medium",
            "opacity-50 cursor-not-allowed",
            collapsed && "px-2"
          )}
          disabled={true}
        >
          <item.icon 
            className={cn(
              "h-4 w-4 flex-shrink-0",
              collapsed ? "mx-auto" : "mr-3",
              "text-muted-foreground"
            )}
          />
          
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate text-muted-foreground">
                {item.name}
              </span>
              
              {item.badge && (
                <span className="ml-auto bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="block w-full"
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-10 transition-all duration-200",
          "text-sm font-medium",
          // Active state
          active && "bg-muted/50 border-l-2 border-l-indigo-500",
          // Hover state
          !active && "hover:bg-muted/30 hover:text-foreground",
          // Collapsed state
          collapsed && "px-2"
        )}
      >
        <item.icon 
          className={cn(
            "h-4 w-4 flex-shrink-0",
            collapsed ? "mx-auto" : "mr-3",
            active ? "text-foreground" : "text-muted-foreground"
          )}
          style={active ? { color: moduleColor } : undefined}
        />
        
        {!collapsed && (
          <>
            <span 
              className={cn(
                "flex-1 text-left truncate",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.name}
            </span>
            
            {item.badge && (
              <span className="ml-auto bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Button>
    </Link>
  )
}

export function ModuleSidebar({ 
  activeModule, 
  collapsed = false,
  onItemClick 
}: ModuleSidebarProps) {
  const pathname = usePathname()
  const moduleConfig = getModuleConfig(activeModule)

  if (!moduleConfig) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">Module not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 px-3">
      {/* Module Header */}
      {!collapsed && (
        <div className="px-3 py-2">
          <div 
            className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            style={{ color: moduleConfig.color }}
          >
            <moduleConfig.icon className="h-3 w-3" />
            {moduleConfig.name}
          </div>
        </div>
      )}

      {/* Module Navigation Items */}
      <div className="space-y-1">
        {moduleConfig.items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <ModuleNavItem
              key={item.id}
              item={item}
              active={isActive}
              collapsed={collapsed}
              moduleColor={moduleConfig.color}
              onClick={onItemClick}
            />
          )
        })}
      </div>

      {/* Module Description (when expanded) */}
      {!collapsed && moduleConfig.description && (
        <div className="px-3 pt-4 pb-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {moduleConfig.description}
          </p>
        </div>
      )}
    </div>
  )
}

// Helper component for tooltip when collapsed
export function CollapsedModuleTooltip({ 
  moduleId, 
  children 
}: { 
  moduleId: string
  children: React.ReactNode 
}) {
  const moduleConfig = getModuleConfig(moduleId)
  
  if (!moduleConfig) return <>{children}</>

  return (
    <div title={`${moduleConfig.name} - ${moduleConfig.description}`}>
      {children}
    </div>
  )
}