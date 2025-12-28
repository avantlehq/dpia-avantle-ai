'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useSidebarToggle } from '@/hooks/useSidebarToggle'

// Create context with the hook's return type
const SidebarContext = createContext<ReturnType<typeof useSidebarToggle> | null>(null)

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const sidebarState = useSidebarToggle()
  
  return (
    <SidebarContext.Provider value={sidebarState}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}