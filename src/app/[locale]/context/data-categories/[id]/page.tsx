/**
 * Edit Data Category Page
 *
 * Full-page form for editing an existing data category.
 */

import { notFound } from 'next/navigation'
import { DataCategoryForm } from '@/components/context/DataCategoryForm'
import { ContextService } from '@/lib/api/context/services/context.service'
import { createContextClient } from '@/lib/api/context/supabase-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditDataCategoryPage({ params }: Props) {
  const { id } = await params

  const context = {
    tenant_id: '00000000-0000-0000-0000-000000000001',
    workspace_id: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
  }

  const client = createContextClient(context)
  const contextService = new ContextService(context, client)
  const category = await contextService.dataCategories.getDataCategoryById(id)

  if (!category) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DataCategoryForm mode="edit" categoryId={id} initialData={category as any} />
}
