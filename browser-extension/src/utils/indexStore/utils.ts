import { ShopifyProduct, isFulfilled } from '@/types'
import { oneLineCommaListsAnd } from 'common-tags'
import striptags from 'striptags'
import { logger } from '../logger'

export const shopifyProductToString = (s: ShopifyProduct, storeUrl: string) => {
  const description = s?.body_html ? striptags(s.body_html) : ''

  const title = s.title
  const product_type = s.product_type
  const p = new Set(s.variants?.map((v) => v.price))
  const price_range = oneLineCommaListsAnd`${Array.from(p)}`
  const vendor = s.vendor
  const product_image = s.images[0]?.src
  const product_link = `${storeUrl}/products/${s.handle}`
  const requires_shipping = s.variants.some((v) => v.requires_shipping)

  const variants = oneLineCommaListsAnd`${s.variants?.map((s) => s.title)}`

  return JSON.stringify({
    description,
    title,
    product_type,
    product_image,
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

export const sanitize = (s: ShopifyProduct, storeUrl: string) => {
  const description = s?.body_html ? striptags(s.body_html) : ''
  const title = s.title
  const product_type = s.product_type
  const vendor = s.vendor

  const prod = {
    id: s.id,
    title,
    description: cap(`${title},${product_type}, ${description}, ${storeUrl}`),
    vendor,
    handle: s.handle,
    lastPublished: new Date(s.updated_at),
    content: shopifyProductToString(s, storeUrl),
  }

  return prod
}

export type ShopifyResponse = ReturnType<typeof sanitize>

export const getProducts = async (store: string) => {
  const pages = 5
  const maxProducts = Array(pages)
    .fill('_')
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`)

  const products = await Promise.allSettled(maxProducts.map(fetcher))

  logger(
    'PRODUCTS WE COULDN"T SAVE',
    products.filter((item) => item.status === 'rejected').length,
  )

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat() as ShopifyProduct[]

  return response.flat().filter(Boolean)
}

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url)
    const products = (await response.json()).products as ShopifyProduct[]

    return products
  } catch (error) {
    logger(url)
  }
}

const cap = (text: string) => {
  const ss = text.split(',')

  while (ss.join(',').length > 200) {
    ss.pop()
  }

  return ss.join(',')
}
