import { createClient, SupabaseClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://tfidwhcedleuieodvvvj.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaWR3aGNlZGxldWllb2R2dnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1MzA2ODEsImV4cCI6MjAxMDEwNjY4MX0.SqJ8w0EEEsQ1f0OEolGRpLozSQR5S7cfoGUcX9TWvrM'

class Supabase {
  static client: SupabaseClient

  static getClient() {
    if (!this.client) {
      this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
    }

    return this.client
  }
}

export default Supabase
