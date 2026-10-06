"""Supabase client configuration for the Chamran Ahvaz School website."""
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'chamran-school-website',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 100,
    },
  },
})

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string
          name: string
          grade: 'elementary' | 'first' | 'second'
          gender: 'boys' | 'girls'
          subdomain: string
          capacity: number
          teacher_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          grade: 'elementary' | 'first' | 'second'
          gender: 'boys' | 'girls'
          subdomain: string
          capacity: number
          teacher_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['classes']['Insert']>
      }
      teachers: {
        Row: {
          id: string
          name: string
          subject: string
          title: string
          bio: string
          image_url: string
          subdomain: string
          email: string
          phone: string
          availability: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          title: string
          bio: string
          image_url: string
          subdomain: string
          email: string
          phone: string
          availability: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['teachers']['Insert']>
      }
      school_settings: {
        Row: {
          id: string
          school_name: string
          school_name_en: string
          logo_url: string
          favicon_url: string
          phone: string
          email: string
          address: string
          principal_name: string
          established_year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_name: string
          school_name_en?: string
          logo_url: string
          favicon_url: string
          phone: string
          email: string
          address: string
          principal_name: string
          established_year: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['school_settings']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceKey: supabaseServiceKey,
}

export async function getServerSupabase() {
  const { createServerClient } = await import('@supabase/auth-helpers-nextjs')
  const { cookies } = await import('next/headers')
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies().get(name)?.value
      },
      set(name, value, options) {
        cookies().set({ name, value, ...options })
      },
      remove(name, options) {
        cookies().delete({ name, ...options })
      },
    },
  })
}