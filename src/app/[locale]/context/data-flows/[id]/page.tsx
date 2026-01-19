/**
 * Edit Data Flow Page
 *
 * Full-page form for editing an existing data flow.
 */

import { notFound } from 'next/navigation'
import { DataFlowForm } from '@/components/context/DataFlowForm'
import { getDataFlow } from '@/lib/context/data-flows'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditDataFlowPage({ params }: Props) {
  const { id } = await params

  // Note: Data flows service not yet implemented, using client library
  const flow = await getDataFlow(id)

  if (!flow) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DataFlowForm mode="edit" flowId={id} initialData={flow as any} />
}
