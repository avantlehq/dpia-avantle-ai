import type { Metadata } from "next";
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AppLayoutWrapper } from '@/components/layout/app-layout-wrapper'
import "./globals.css"

export const metadata: Metadata = {
  title: "DPIA.ai Privacy Platform - European GDPR Compliance",
  description: "European GDPR compliance platform for Data Protection Impact Assessments with privacy by design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
