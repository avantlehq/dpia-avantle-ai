import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SimpleLayout } from '@/components/layout/simple-layout'
import { locales } from '@/i18n/config'
import "../globals.css"

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
  if (!locales.includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  const messages = await getMessages();
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <SimpleLayout>
            {children}
          </SimpleLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}