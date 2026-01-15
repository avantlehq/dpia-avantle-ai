/**
 * Edit Location Page
 *
 * Full-page form for editing an existing location/jurisdiction.
 */

import { notFound } from 'next/navigation'
import { LocationForm } from '@/components/context/LocationForm'
import { getLocation } from '@/lib/context/locations'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditLocationPage({ params }: Props) {
  const { locale, id } = await params

  // Fetch location data (server-side)
  const location = await getLocation(id)

  if (!location) {
    notFound()
  }

  return <LocationForm mode="edit" locale={locale} locationId={id} initialData={location} />
}
