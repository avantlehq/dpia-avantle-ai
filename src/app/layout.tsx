import type { Metadata } from "next";
import "./globals.css"

// Force dynamic rendering to resolve SSR issues
export const dynamic = 'force-dynamic'

// This layout is only used for locale detection and redirects
// The actual layout is in [locale]/layout.tsx

export const metadata: Metadata = {
  title: "DPIA.ai Privacy Platform - European GDPR Compliance",
  description: "European GDPR compliance platform for Data Protection Impact Assessments with privacy by design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
