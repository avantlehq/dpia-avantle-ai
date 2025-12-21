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
  type ModuleConfig 
} from '@/lib/state/modules'

interface ModuleTabProps {
  module: ModuleConfig
  active: boolean
  disabled?: boolean
}

function ModuleTab({ module, active, disabled }: ModuleTabProps) {
  if (disabled) {
    return (
      <div className="group relative cursor-not-allowed">
        <Button
          variant="ghost"
          className={cn(
            "h-10 px-4 py-2 text-sm font-medium transition-all duration-200",
            "border-b-2 border-transparent rounded-none",
            "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground"
          )}
          disabled={true}
        >
          <module.icon className="h-4 w-4 mr-2 text-muted-foreground" />
          {module.name}
        </Button>
      </div>
    )
  }

  return (
    <Link href={module.href} className="group relative">
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
          ]
        )}
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
    </Link>
  )
}

interface ModuleTopbarProps {
  className?: string
}

export function ModuleTopbar({ 
  className 
}: ModuleTopbarProps) {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  
  // Get all modules - no license filtering
  const visibleModules = getVisibleModules()
  
  // Enhanced debug logging
  console.log('ModuleTopbar Enhanced Debug:', {
    pathname,
    activeModuleId,
    visibleModulesCount: visibleModules.length,
    visibleModules: visibleModules.map(m => ({ 
      id: m.id, 
      name: m.name, 
      itemCount: m.items.length,
      enabledItems: m.items.filter(item => !item.disabled).length,
      allItemsDisabled: m.items.every(item => item.disabled)
    })),
    allModulesConfig: privacyModulesConfig.map(m => ({ id: m.id, name: m.name }))
  })
  
  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {/* DEBUG: Temporary test element */}
      <div className="bg-red-500 text-white px-2 py-1 text-xs">
        TEST: {visibleModules.length} modules
      </div>
      {visibleModules.map((module) => {
        const isActive = activeModuleId === module.id
        // Show all modules regardless of disabled items - no filtering
        const isDisabled = false // Force all modules to be enabled

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