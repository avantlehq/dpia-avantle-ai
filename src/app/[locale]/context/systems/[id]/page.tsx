/**
 * Edit System Page
 *
 * Full-page form for editing an existing IT system.
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SystemForm } from '@/components/context/SystemForm'
import { getSystem } from '@/lib/context/systems'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditSystemPage({ params }: Props) {
  const { locale, id } = await params

  // Fetch system data (server-side)
  const system = await getSystem(id)

  if (!system) {
    notFound()
  }

  return <SystemForm mode="edit" locale={locale} systemId={id} initialData={system} />
}
