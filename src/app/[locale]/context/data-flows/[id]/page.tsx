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
  const { locale, id } = await params

  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const flow = await contextService.dataFlows.getFlowById(id)

  if (!flow) {
    notFound()
  }

  return <DataFlowForm mode="edit" locale={locale} flowId={id} initialData={flow} />
}
