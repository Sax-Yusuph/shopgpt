import { ShopifyProduct, isFulfilled } from '@/types'
import { oneLineCommaListsAnd } from 'common-tags'
import striptags from 'striptags'

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

export const sanitize = (s: ShopifyProduct, storeUrl: string) => {
  const description = s?.body_html ? striptags(s.body_html) : ''
  const title = s.title
  const product_type = s.product_type
  const vendor = s.vendor

  const prod = {
    id: s.id,
    title,
    description: cap(`${title},${product_type}, ${description}`),
    vendor,
    handle: s.handle,
    lastPublished: new Date(s.updated_at),
    content: shopifyProductToString(s, storeUrl),
  }

  return prod
}

export type ShopifyResponse = ReturnType<typeof sanitize>

export const getProducts = async (store: string) => {
  //
  const pages = 5
  const maxProducts = Array(pages)
    .fill('_')
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`)

  const products = await Promise.allSettled(maxProducts.map(fetcher))

  console.log(products.filter((item) => item.status === 'rejected'))

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat() as ShopifyProduct[]

  return response.flat().filter((item) => {
    //filter unnecessary products

    return Boolean(item)
    //1. only index available products
    // item?.variants.some((variant) =>
    //   variant.available === false ? false : true,
    // )
  })
}

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url)
    const products = (await response.json()).products as ShopifyProduct[]

    return products
  } catch (error) {
    // console.log(url);
    // return { error: "Incorrect store address", products: null };
  }
}

const cap = (text: string) => {
  const ss = text.split(',')

  while (ss.join(',').length > 200) {
    ss.pop()
  }

  return ss.join(',')
}
