import { Product } from '@/types'
import { Message } from 'ai'

export function getContext(products: Product[]) {
  let contextText = ''

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const content = product.data

    contextText += `---\n ${content.replace('\\', '').trim()}\n ---`
  }

  return cap(contextText)
}
// little hack to ensure the limit is not exceeded
const cap = (text: string) => text.split(' ').slice(0, 2800).join(' ')

export function capMessages(
  initMessages: Message[],
  contextMessages: Message[],
) {
  const cappedContextMessages = [...contextMessages]

  const mm = [...initMessages, ...cappedContextMessages]

  return mm
}
