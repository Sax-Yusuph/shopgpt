import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ROLE_KEY, {
  auth: { persistSession: false }
})