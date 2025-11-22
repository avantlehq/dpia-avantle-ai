import type { Metadata } from "next";
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AppLayoutWrapper } from '@/components/layout/app-layout-wrapper'
import "./globals.css"

export const metadata: Metadata = {
  title: "DPIA Agent - Automated GDPR Assessments",
  description: "Create, manage and export GDPR-compliant Data Protection Impact Assessments with AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans dark antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
