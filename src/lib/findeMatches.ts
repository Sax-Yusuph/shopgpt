import { generateEmbedding } from './generateEmbedding'
import { supabaseClient } from './supabase'

export const findMatches = async (text: string) => {
  const embedding = await generateEmbedding(text, 'embed')

  const { error: matchError, data: products } = await supabaseClient
    .rpc('match_products', {
      embedding,
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 10 // Choose the number of matches
    })
    .limit(10)

  if (matchError) {
    throw new Error(matchError.message)
  }

  //@ts-ignore
  return products.map(p => ({
    content: p.content,
    properties: p.properties,
    decription: p.description,
    brand: p.brand,
    name: p.name
  }))
}
