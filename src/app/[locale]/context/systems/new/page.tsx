/**
 * Create New System Page
 *
 * Full-page form for creating a new IT system.
 */

import { SystemForm } from '@/components/context/SystemForm'

type Props = {
  params: { locale: string }
}

export default function NewSystemPage({ params }: Props) {
  const { locale } = params

  return <SystemForm mode="create" locale={locale} />
}
