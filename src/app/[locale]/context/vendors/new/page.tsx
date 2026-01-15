/**
 * Create New Vendor Page
 *
 * Full-page form for creating a new vendor/processor.
 */

import { VendorForm } from '@/components/context/VendorForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewVendorPage({ params }: Props) {
  const { locale } = await params

  return <VendorForm mode="create" locale={locale} />
}
