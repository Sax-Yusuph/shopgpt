import { Product } from '@/types'
import { COMPLETION_MODEL } from './constants'
import { tokenizer } from './tokenizer'

export function getContext(products: Product[], model = COMPLETION_MODEL) {
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const content = product.data
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.length

    const max = model?.includes('gpt-4') || model?.includes('16k') ? 5000 : 1500

    if (tokenCount >= max) {
      break
    }

    contextText += `---\n ${content.trim()}\n ---`
  }

  return contextText
}
