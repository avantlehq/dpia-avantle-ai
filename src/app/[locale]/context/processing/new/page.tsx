/**
 * Create Processing Activity Page
 *
 * Full-page form for creating a new processing activity (ROPA entry).
 */

import { ProcessingActivityForm } from '@/components/context/ProcessingActivityForm'

export default async function NewProcessingActivityPage() {
  return <ProcessingActivityForm mode="create" />
}
