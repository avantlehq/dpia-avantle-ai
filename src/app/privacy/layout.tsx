import React, { type ReactNode } from 'react'
import { AppLayoutWrapper } from '@/components/layout/app-layout-wrapper'

// Privacy Module Layout - uses new module-aware navigation
export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayoutWrapper>
      {children}
    </AppLayoutWrapper>
  )
}