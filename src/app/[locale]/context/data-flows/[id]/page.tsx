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
  const { locale, id } = await params

  // Fetch data flow data (server-side)
  const flow = await getDataFlow(id)

  if (!flow) {
    notFound()
  }

  return <DataFlowForm mode="edit" locale={locale} flowId={id} initialData={flow} />
}
