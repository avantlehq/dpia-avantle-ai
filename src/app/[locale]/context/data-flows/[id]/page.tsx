/**
 * Edit Data Flow Page
 *
 * Full-page form for editing an existing data flow.
 */

import { notFound } from 'next/navigation'
import { DataFlowForm } from '@/components/context/DataFlowForm'
import { ContextService } from '@/lib/api/context/services/context.service'
import { createContextClient } from '@/lib/api/context/supabase-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditDataFlowPage({ params }: Props) {
  const { id } = await params

  // Server-side data fetching using ContextService directly (not HTTP API)
  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const flow = await contextService.dataFlows.getDataFlowById(id)

  if (!flow) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DataFlowForm mode="edit" flowId={id} initialData={flow as any} />
}
