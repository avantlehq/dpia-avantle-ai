/**
 * Create New Data Flow Page
 *
 * Full-page form for creating a new data flow.
 */

import { DataFlowForm } from '@/components/context/DataFlowForm'

export default async function NewDataFlowPage() {
  return <DataFlowForm mode="create" />
}
