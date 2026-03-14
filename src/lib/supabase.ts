import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://whnwyibqnwemvpxqavvl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indobnd5aWJxbndlbXZweHFhdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTkyODYsImV4cCI6MjA4ODU3NTI4Nn0.StzM-cqsx_DAgiD8IBU1cmZbLgev4QxJkWdiQJGIXWk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  description: string | null
  selling_price: number | null
  category: string
  image_url: string | null
  featured: boolean
  active: boolean
  created_at: string
}
