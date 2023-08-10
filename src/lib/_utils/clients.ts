import { createClient } from '@supabase/supabase-js'
import OpenAi from 'openai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { ApplicationError } from './errors'

const OPENAI_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export const getSdk = () => {
  if (!OPENAI_KEY) {
    throw new ApplicationError('Missing environment variable OPENAI_KEY')
  }

  if (!SUPABASE_URL) {
    throw new ApplicationError('Missing environment variable SUPABASE_URL')
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApplicationError(
      'Missing environment variable SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  const openAi = new OpenAi({ apiKey: OPENAI_KEY })

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openAiEdge = new OpenAIApi(config)

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  })

  return { openAi, openAiEdge, supabaseClient, OPENAI_KEY }
}
