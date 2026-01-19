/**
 * Create New Data Category Page
 *
 * Full-page form for creating a new data category.
 */

import { DataCategoryForm } from '@/components/context/DataCategoryForm'

export default async function NewDataCategoryPage() {
  return <DataCategoryForm mode="create" />
}
