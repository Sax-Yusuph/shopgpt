import { Message, MessageRole } from './constants'
import { ShopifyProduct } from './types'

import { oneLineCommaListsAnd } from 'common-tags'
import striptags from 'striptags'
export type Product = { title: string; data: string }

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export enum STORAGE {
  SYSTEM_PROMPT = 'sys_prompt',
  PREFFERED_STORE = 'selectedStore',
  PREFFERED_STORE_PROMPT = 'preferredText',
  SYSTEM_PROMPT_HISTORY = 'system-prompt-history-v2',
  LLM_MODEL = 'llm-model',
}

export const initMessages = (
  contextText: string,
  systemPrompt: string,
): Message[] => {
  const prompt = systemPrompt

  const modifiedPrompt = prompt.replace('{{available_products}}', contextText)

  return [
    {
      role: MessageRole.System,
      content: modifiedPrompt,
    },
  ]
}

export const initialStorePrompt =
  'i want only products from {{preferred_store}} store'

export const initialSystemPrompt = `
  
  - You are a shopping assistant who loves to help to help people!;
  
  - you will be provided a list of products in json format to choose from
   
  - Answer in the following format in markdown
  
  - Product name and description also tell me why it is a better product
  
  - Information on available sizes, product link and price
  
  - you must also provide each product image.
  
  --- 
  here are the available products
  {{available_products}}
  ___
  
  
  `

export const shopifyProductToString = (s: ShopifyProduct, storeUrl: string) => {
  const description = s?.body_html ? striptags(s.body_html) : ''

  const title = s.title
  const product_type = s.product_type
  const p = new Set(s.variants?.map((v) => v.price))
  const price_range = oneLineCommaListsAnd`${Array.from(p)}`
  const vendor = s.vendor
  const product_images = s.images.slice(0, 1).map((t) => t.src)
  const product_link = `${storeUrl}/products/${s.handle}`
  const requires_shipping = s.variants.some((v) => v.requires_shipping)

  const variants = oneLineCommaListsAnd`${s.variants?.map((s) => s.title)}`

  return JSON.stringify({
    description,
    title,
    product_type,
    product_images,
    product_link,
    variants,
    price_range,
    vendor,
    handle: s.handle,
    lastPublished: s.updated_at,
    createdAt: s.created_at,
    requires_shipping,
  })
}
