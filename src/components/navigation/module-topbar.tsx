'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  privacyModulesConfig, 
  getActiveModule, 
  getVisibleModules,
  DEFAULT_DEV_LICENSES,
  type ModuleConfig 
} from '@/lib/state/modules'

interface ModuleTabProps {
  module: ModuleConfig
  active: boolean
  disabled?: boolean
}

function ModuleTab({ module, active, disabled }: ModuleTabProps) {
  const TabComponent = disabled ? 'div' : Link

  return (
    <TabComponent
      href={disabled ? undefined : module.href}
      className={cn(
        "group relative",
        disabled && "cursor-not-allowed"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "h-10 px-4 py-2 text-sm font-medium transition-all duration-200",
          "border-b-2 border-transparent rounded-none",
          // Active state
          active && [
            "text-foreground border-b-indigo-500 bg-muted/30"
          ],
          // Inactive state  
          !active && [
            "text-muted-foreground hover:text-foreground hover:bg-muted/20"
          ],
          // Disabled state
          disabled && [
            "opacity-50 cursor-not-allowed hover:bg-transparent"
          ]
        )}
        disabled={disabled}
      >
        <module.icon 
          className={cn(
            "h-4 w-4 mr-2",
            active && "text-indigo-500"
          )}
          style={active ? { color: module.color } : undefined}
        />
        {module.name}
      </Button>

      {/* Active indicator line */}
      {active && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
          style={{ backgroundColor: module.color }}
        />
      )}
    </TabComponent>
  )
}

interface ModuleTopbarProps {
  userLicenses?: string[]
  className?: string
}

export function ModuleTopbar({ 
  userLicenses = DEFAULT_DEV_LICENSES,
  className 
}: ModuleTopbarProps) {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  
  // Get modules based on user licenses
  const visibleModules = getVisibleModules(userLicenses)
  
  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {visibleModules.map((module) => {
        const isActive = activeModuleId === module.id
        const isDisabled = module.items.every(item => item.disabled)

        return (
          <ModuleTab
            key={module.id}
            module={module}
            active={isActive}
            disabled={isDisabled}
          />
        )
      })}
    </nav>
  )
}

// Breadcrumb component for module context
export function ModuleBreadcrumb() {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  
  if (!activeModuleId) return null
  
  const moduleConfig = privacyModulesConfig.find(m => m.id === activeModuleId)
  
  // Extract page from pathname
  const pathParts = pathname.split('/').filter(Boolean)
  const pageName = pathParts[pathParts.length - 1] || 'Overview'
  
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <span className="hover:text-foreground transition-colors">HOME</span>
      <span>{'>'}</span>
      <span 
        className="hover:text-foreground transition-colors font-medium"
        style={{ color: moduleConfig?.color }}
      >
        {moduleConfig?.name}
      </span>
      <span>{'>'}</span>
      <span className="text-foreground font-medium capitalize">
        {pageName === 'precheck' ? 'DPIA Pre-Check' :
         pageName === 'assessments' ? 'DPIA Assessments' :
         pageName.replace('-', ' ')}
      </span>
    </div>
  )
}