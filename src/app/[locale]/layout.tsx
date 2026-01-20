import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SimpleLayout } from '@/components/layout/simple-layout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { locales } from '@/i18n/config'
import "../globals.css"

// Force dynamic rendering to resolve persistent SSR issues
export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'sk' 
    ? "DPIA.ai Privacy Platform - Európska GDPR Compliance"
    : "DPIA.ai Privacy Platform - European GDPR Compliance";
  
  const description = locale === 'sk'
    ? "Európska GDPR compliance platforma pre Hodnotenia vplyvu na ochranu údajov s privacy by design."
    : "European GDPR compliance platform for Data Protection Impact Assessments with privacy by design.";

  return {
    title,
    description,
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }
 
  // Providing all messages to the client
  // CRITICAL FIX: Explicitly pass locale to getMessages() - was defaulting to 'en'
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <SimpleLayout>
              {children}
            </SimpleLayout>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}