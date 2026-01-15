/**
 * Create Processing Activity Page
 *
 * Full-page form for creating a new processing activity (ROPA entry).
 */

import { ProcessingActivityForm } from '@/components/context/ProcessingActivityForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewProcessingActivityPage({ params }: Props) {
  const { locale } = await params

  return <ProcessingActivityForm mode="create" locale={locale} />
}
