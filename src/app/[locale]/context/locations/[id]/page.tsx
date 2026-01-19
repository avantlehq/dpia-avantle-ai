/**
 * Edit Location Page
 *
 * Full-page form for editing an existing location/jurisdiction.
 */

import { notFound } from 'next/navigation'
import { LocationForm } from '@/components/context/LocationForm'
import { ContextService } from '@/lib/api/context/services/context.service'
import { createContextClient } from '@/lib/api/context/supabase-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditLocationPage({ params }: Props) {
  const { locale: _locale, id } = await params

  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const location = await contextService.physicalLocations.getLocationById(id)

  if (!location) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <LocationForm mode="edit" locationId={id} initialData={location as any} />
}
