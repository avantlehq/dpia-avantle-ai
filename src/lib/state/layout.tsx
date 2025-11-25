'use client'

import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface LayoutState {
  // Sidebar state
  leftSidebarOpen: boolean
  rightPanelOpen: boolean
  
  // Mobile state
  mobileSidebarOpen: boolean
  
  // Wizard state
  wizardStepsOpen: boolean
}

interface LayoutActions {
  toggleLeftSidebar: () => void
  toggleRightPanel: () => void
  toggleMobileSidebar: () => void
  toggleWizardSteps: () => void
  setRightPanelOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
}

interface LayoutContextType extends LayoutState, LayoutActions {}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // State with localStorage persistence - initialize with safe defaults for SSR
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true // SSR default
    try {
      const saved = localStorage.getItem('dpia-sidebar-open')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [wizardStepsOpen, setWizardStepsOpen] = useState(true)

  // Persist to localStorage when changed (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dpia-sidebar-open', JSON.stringify(leftSidebarOpen))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [leftSidebarOpen])
  
  // Actions
  const toggleLeftSidebar = () => setLeftSidebarOpen((prev: boolean) => !prev)
  const toggleRightPanel = () => setRightPanelOpen((prev: boolean) => !prev)
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev: boolean) => !prev)
  const toggleWizardSteps = () => setWizardStepsOpen((prev: boolean) => !prev)
  
  const value: LayoutContextType = {
    // State
    leftSidebarOpen,
    rightPanelOpen,
    mobileSidebarOpen,
    wizardStepsOpen,
    
    // Actions
    toggleLeftSidebar,
    toggleRightPanel,
    toggleMobileSidebar,
    toggleWizardSteps,
    setRightPanelOpen,
    setMobileSidebarOpen,
  }
  
  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

// Hook to use layout context
export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    // During SSR/prerendering, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        leftSidebarOpen: true,
        rightPanelOpen: false,
        mobileSidebarOpen: false,
        wizardStepsOpen: true,
        toggleLeftSidebar: () => {},
        toggleRightPanel: () => {},
        toggleMobileSidebar: () => {},
        toggleWizardSteps: () => {},
        setRightPanelOpen: () => {},
        setMobileSidebarOpen: () => {},
      }
    }
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

// Separate hooks for convenience
export const useLayoutState = () => {
  const { leftSidebarOpen, rightPanelOpen, mobileSidebarOpen, wizardStepsOpen } = useLayout()
  return { leftSidebarOpen, rightPanelOpen, mobileSidebarOpen, wizardStepsOpen }
}

export const useLayoutActions = () => {
  const { 
    toggleLeftSidebar,
    toggleRightPanel,
    toggleMobileSidebar,
    toggleWizardSteps,
    setRightPanelOpen,
    setMobileSidebarOpen,
  } = useLayout()
  
  return {
    toggleLeftSidebar,
    toggleRightPanel,
    toggleMobileSidebar,
    toggleWizardSteps,
    setRightPanelOpen,
    setMobileSidebarOpen,
  }
}