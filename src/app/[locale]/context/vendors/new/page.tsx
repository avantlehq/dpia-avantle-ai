/**
 * Create New Vendor Page
 *
 * Full-page form for creating a new vendor/processor.
 */

import { VendorForm } from '@/components/context/VendorForm'

export default async function NewVendorPage() {
  return <VendorForm mode="create" />
}
