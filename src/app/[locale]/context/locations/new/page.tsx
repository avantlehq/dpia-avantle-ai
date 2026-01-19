/**
 * Create New Location Page
 *
 * Full-page form for creating a new location/jurisdiction.
 */

import { LocationForm } from '@/components/context/LocationForm'

export default async function NewLocationPage() {
  return <LocationForm mode="create" />
}
