/**
 * Edit Data Category Page
 *
 * Full-page form for editing an existing data category.
 */

import { notFound } from 'next/navigation'
import { DataCategoryForm } from '@/components/context/DataCategoryForm'
import { getDataCategory } from '@/lib/context/data-categories'

type Props = {
  params: { locale: string; id: string }
}

export default async function EditDataCategoryPage({ params }: Props) {
  const { locale, id } = params

  // Fetch data category (server-side)
  const category = await getDataCategory(id)

  if (!category) {
    notFound()
  }

  return <DataCategoryForm mode="edit" locale={locale} categoryId={id} initialData={category} />
}
