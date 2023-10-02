import { Product } from '@/types'
import Pipeline from './embeddings/pipeline'
import Supabase from './supabase'

export const getMatches = async (userMessage: string, storeUrl = '') => {
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const embedding = await Pipeline.transform(userMessage)

  const client = Supabase.getClient()

  const { error: matchError, data: products } = await client.rpc(
    'find_similar',
    {
      embedding,
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 20, // Choose the number of matches
      store_url: storeUrl,
    },
  )

  if (matchError) {
    console.warn(matchError)
  }

  return products as Product[]
}
