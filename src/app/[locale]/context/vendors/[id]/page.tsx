/**
 * Edit Vendor Page
 *
 * Full-page form for editing an existing vendor/processor.
 */

import { notFound } from 'next/navigation'
import { VendorForm } from '@/components/context/VendorForm'
import { ContextService } from '@/lib/api/context/services/context.service'
import { createContextClient } from '@/lib/api/context/supabase-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditVendorPage({ params }: Props) {
  const { locale, id } = await params

  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const vendor = await contextService.vendors.getVendorById(id)

  if (!vendor) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <VendorForm mode="edit" locale={locale} vendorId={id} initialData={vendor as any} />
}
