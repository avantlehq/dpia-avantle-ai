/**
 * Create New System Page
 *
 * Full-page form for creating a new IT system.
 */

import { SystemForm } from '@/components/context/SystemForm'

export default async function NewSystemPage() {
  return <SystemForm mode="create" />
}
