import { Pipeline, env, pipeline } from '@xenova/transformers'
import { Product, sanitizeJson } from './_utils/clean'
import csvToJson from './csvToJson'
import { supabaseClient } from './supabase'
type Obj = Record<string, string>

// @ts-ignore
env.allowLocalModels = false

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
  static task = 'feature-extraction'
  static model = 'Supabase/gte-small'
  static instance: Pipeline | null = null

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model)
    }
    return this.instance
  }
}

export const generateEmbedding = async (
  csvData: string,
  action: 'train' | 'embed' = 'train'
) => {
  const embed = await PipelineSingleton.getInstance()

  if (action === 'embed') {
    const embedding = await embed(csvData, { pooling: 'mean', normalize: true })
    return Array.from(embedding.data)
  }

  const json = csvToJson({ data: csvData }) as Obj[]
  const products = sanitizeJson(json)

  const results = await Promise.all(
    products.map(p =>
      embed(p.embeddingString, {
        pooling: 'mean',
        normalize: true
      }).then((output: { data: Iterable<unknown> | ArrayLike<unknown> }) => {
        const embedding = Array.from(output.data)

        return {
          embedding,
          properties: transform(p),
          description: p.embeddingString,
          brand: p.Vendor,
          name: p.Title
        }
      })
    )
  )

  try {
    return supabaseClient.from('product').insert(results)
  } catch (error) {
    console.log(error)
  }
}

export function transform(data: Product) {
  let content = ''

  for (const d in data) {
    content += `${d}: ${data[d as keyof Product]}\n`
  }

  return `---\n ${content} \n---`
}
