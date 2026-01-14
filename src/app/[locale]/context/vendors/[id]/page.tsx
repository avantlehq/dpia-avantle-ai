/**
 * Edit Vendor Page
 *
 * Full-page form for editing an existing vendor/processor.
 */

import { notFound } from 'next/navigation'
import { VendorForm } from '@/components/context/VendorForm'
import { getVendor } from '@/lib/context/vendors'

type Props = {
  params: { locale: string; id: string }
}

export default async function EditVendorPage({ params }: Props) {
  const { locale, id } = params

  // Fetch vendor data (server-side)
  const vendor = await getVendor(id)

  if (!vendor) {
    notFound()
  }

  return <VendorForm mode="edit" locale={locale} vendorId={id} initialData={vendor} />
}
