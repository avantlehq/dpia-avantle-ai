/**
 * Create New Data Flow Page
 *
 * Full-page form for creating a new data flow.
 */

import { DataFlowForm } from '@/components/context/DataFlowForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewDataFlowPage({ params }: Props) {
  const { locale } = await params

  return <DataFlowForm mode="create" locale={locale} />
}
