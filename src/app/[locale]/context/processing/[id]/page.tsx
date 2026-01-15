/**
 * Edit Processing Activity Page
 *
 * Full-page form for editing an existing processing activity.
 */

import { notFound } from 'next/navigation'
import { ProcessingActivityForm } from '@/components/context/ProcessingActivityForm'
import { getProcessingActivity } from '@/lib/context/processing-activities'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditProcessingActivityPage({ params }: Props) {
  const { locale, id } = await params

  // Fetch processing activity data (server-side)
  const activity = await getProcessingActivity(id)

  if (!activity) {
    notFound()
  }

  return <ProcessingActivityForm mode="edit" locale={locale} activityId={id} initialData={activity} />
}
