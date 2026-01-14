/**
 * Create New Location Page
 *
 * Full-page form for creating a new location/jurisdiction.
 */

import { LocationForm } from '@/components/context/LocationForm'

type Props = {
  params: { locale: string }
}

export default function NewLocationPage({ params }: Props) {
  const { locale } = params

  return <LocationForm mode="create" locale={locale} />
}
