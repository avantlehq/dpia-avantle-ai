/**
 * Create New Data Flow Page
 *
 * Full-page form for creating a new data flow.
 */

import { DataFlowForm } from '@/components/context/DataFlowForm'

type Props = {
  params: { locale: string }
}

export default function NewDataFlowPage({ params }: Props) {
  const { locale } = params

  return <DataFlowForm mode="create" locale={locale} />
}
