/**
 * Create New Data Category Page
 *
 * Full-page form for creating a new data category.
 */

import { DataCategoryForm } from '@/components/context/DataCategoryForm'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewDataCategoryPage({ params }: Props) {
  const { locale } = await params

  return <DataCategoryForm mode="create" locale={locale} />
}
