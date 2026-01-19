/**
 * Edit System Page
 *
 * Full-page form for editing an existing IT system.
 */

import { notFound } from 'next/navigation'
import { SystemForm } from '@/components/context/SystemForm'
import { ContextService } from '@/lib/api/context/services/context.service'
import { createContextClient } from '@/lib/api/context/supabase-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditSystemPage({ params }: Props) {
  const { id } = await params

  // Server-side data fetching using repository directly (not HTTP API)
  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const system = await contextService.systems.getSystemById(id)

  if (!system) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SystemForm mode="edit" systemId={id} initialData={system as any} />
}
