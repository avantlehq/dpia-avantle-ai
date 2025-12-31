import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedHome({ params }: Props) {
  const { locale } = await params;
  
  // Redirect to Privacy Overview as main landing page with locale
  redirect(`/${locale}/privacy`)
}