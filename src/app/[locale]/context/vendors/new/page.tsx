/**
 * Create New Vendor Page
 *
 * Full-page form for creating a new vendor/processor.
 */

import { VendorForm } from '@/components/context/VendorForm'

type Props = {
  params: { locale: string }
}

export default function NewVendorPage({ params }: Props) {
  const { locale } = params

  return <VendorForm mode="create" locale={locale} />
}
