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
  // State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [wizardStepsOpen, setWizardStepsOpen] = useState(true)
  
  // Actions
  const toggleLeftSidebar = () => setLeftSidebarOpen(prev => !prev)
  const toggleRightPanel = () => setRightPanelOpen(prev => !prev)
  const toggleMobileSidebar = () => setMobileSidebarOpen(prev => !prev)
  const toggleWizardSteps = () => setWizardStepsOpen(prev => !prev)
  
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