import { ShopifyProduct } from '@/types';
import { oneLineCommaListsAnd } from 'common-tags';
import striptags from 'striptags';
export type Product = { title: string; data: string }

export const shopifyProductToString = (
  s?: ShopifyProduct,
  storeUrl?: string,
) => {
  if (!s) {
    return ''
  }

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
