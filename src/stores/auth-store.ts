import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { AuthState, User } from '@/lib/types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  
  signIn: async (email: string) => {
    set({ loading: true })
    const supabase = createClient()
    
    if (!supabase) {
      set({ loading: false })
      throw new Error('Authentication service unavailable in demo mode')
    }
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        throw error
      }
    } finally {
      set({ loading: false })
    }
  },
  
  signOut: async () => {
    const supabase = createClient()
    
    if (!supabase) {
      set({ user: null })
      return
    }
    
    const { error } = await supabase.auth.signOut()
    
    if (!error) {
      set({ user: null })
    }
  },
  
  setUser: (user: User | null) => {
    set({ user })
  }
}))