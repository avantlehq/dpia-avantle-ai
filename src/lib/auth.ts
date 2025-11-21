import { createServerClient } from './supabase/server'
import { redirect } from 'next/navigation'
import type { User } from './types'

export async function getUser(): Promise<User | null> {
  const supabase = await createServerClient()
  
  if (!supabase) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireWorkspace(workspaceId: string) {
  const user = await requireAuth()
  const supabase = await createServerClient()
  
  if (!supabase) {
    redirect('/dashboard')
    return
  }
  
  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('user_id', user.id as any)
    .eq('workspace_id', workspaceId as any)
    .single()
  
  if (!member) {
    redirect('/dashboard')
  }
  
  return { user, member }
}

export function getAuthRedirectUrl(locale: string = 'en') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/${locale}/auth/callback`
}