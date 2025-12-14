import type { Metadata } from "next";
import { SimpleLayout } from '@/components/layout/simple-layout'
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
        <SimpleLayout>
          {children}
        </SimpleLayout>
      </body>
    </html>
  );
}
