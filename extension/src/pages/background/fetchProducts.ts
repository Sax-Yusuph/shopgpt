import { ShopifyProduct } from '@/types'
import { sanitize } from './sanitize'

const PAGE_SIZE = 60

export async function fetchProducts(store: string) {
  const urls = pages(store)
  const products = await Promise.allSettled(urls.map(fetcher))

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat(2)
    .filter(Boolean) as ShopifyProduct[]

  if (!response.length) {
    return []
  }

  return sanitize(response, store)
}

async function fetcher(url: string) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })

  const data = (await response.json()) as { products: ShopifyProduct[] }
  return data.products
}

function pages(store: string) {
  return Array(PAGE_SIZE)
    .fill('_')
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`)
}

const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled'
