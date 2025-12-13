import React from 'react'

export default function NewAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout without AppLayoutWrapper to avoid SSR useContext issues
  return (
    <div className="avantle-gradient">
      {children}
    </div>
  )
}