import { PAGE_TYPE, ShopifyProduct } from '@/types'

import { Message } from 'ai'
import { capMessages } from '../match-embeddings/getContext'
import { getPrompts } from './getPrompts'
import { shopifyProductToString } from './shopifyProduct'

interface Params {
  messages: Message[]
  storeUrl: string
  id: string
  contextText: string
  pageType?: PAGE_TYPE
  currentProductOnPage: ShopifyProduct
}

export async function getCompletionMessages(params: Params) {
  const {
    messages,
    contextText,
    currentProductOnPage,
    id,
    pageType = PAGE_TYPE.GENERAL,
    storeUrl,
  } = params

  const currentProductOrCollection = shopifyProductToString(
    currentProductOnPage,
    storeUrl,
  )

  const storeName = storeUrl
    .replace('www.', '')
    .replace(/(?:myshopify\.com|\.com)/, '')

  const prompts = await getPrompts({
    id,
    storeName,
    currentProduct: cap(currentProductOrCollection, 500),
    contextText,
    pageType,
  })

  const completionMessages = capMessages(prompts, messages)

  return completionMessages
}

function cap(text: string, max = 5000) {
  if (!text) {
    return ''
  }

  const ss = text.split(',')

  while (ss.join(',').length > max) {
    ss.pop()
  }

  return ss.join(',')
}
