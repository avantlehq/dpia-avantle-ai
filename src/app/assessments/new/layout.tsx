import React from 'react'

export default function NewAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Remove custom layout - inherit main layout with proper header/footer
  return <>{children}</>
}