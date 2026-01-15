/**
 * Create New Location Page
 *
 * Full-page form for creating a new location/jurisdiction.
 */

import { LocationForm } from '@/components/context/LocationForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewLocationPage({ params }: Props) {
  const { locale } = await params

  return <LocationForm mode="create" locale={locale} />
}
