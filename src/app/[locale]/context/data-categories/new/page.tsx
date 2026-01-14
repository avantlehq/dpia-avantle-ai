/**
 * Create New Data Category Page
 *
 * Full-page form for creating a new data category.
 */

import { DataCategoryForm } from '@/components/context/DataCategoryForm'

type Props = {
  params: { locale: string }
}

export default function NewDataCategoryPage({ params }: Props) {
  const { locale } = params

  return <DataCategoryForm mode="create" locale={locale} />
}
