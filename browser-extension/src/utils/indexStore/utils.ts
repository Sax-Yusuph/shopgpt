import {
  ShopifyProduct,
  ShopifyResponse,
  SupabaseProduct,
  isFulfilled,
} from '@/types'
import { oneLineCommaListsAnd } from 'common-tags'
import striptags from 'striptags'
import PipelineSingleton from '../embeddings/pipeline'
import { ERR, safe } from '../error'
import { logger } from '../logger'

export async function getProducts(store: string) {
  const products = await Promise.allSettled(pages(store).map(fetcher))

  logger(
    'PRODUCTS WE COULDN"T SAVE',
    products.filter((item) => item.status === 'rejected').length,
  )

  const response = products
    .filter(isFulfilled)
    .map((t) => t.value)
    .flat(2)
    .filter(Boolean) as ShopifyProduct[]

  if (!response.length) {
    logger('NO PRODUCTS FOUND ', store)
    return
  }

  logger('PRODUCTS FOUND', response.length)

  return sanitize(response, store)
}

export async function getProductEmbeddings(
  products: ShopifyResponse[],
  store: string,
) {
  const embed = await PipelineSingleton.getInstance()

  const productsChunk = chunk(products)

  const embeddings: SupabaseProduct[] = []

  for (const section of productsChunk) {
    await Promise.all(
      section.map(async (p: ShopifyResponse, i) => {
        const dataToEmbed = p.description

        logger('Started embeding for product ', i + 1)

        const output = await safe<{ data: ArrayLike<number> }>(
          embed(dataToEmbed, {
            pooling: 'mean',
            normalize: true,
          }),
        )

        if (output.kind === ERR) {
          logger('EMBEDDING FAILED ', output.error)
          return
        }

        logger('COMPLETE embeding for product ', i + 1)

        const embedding = Array.from(output.value.data)

        embeddings.push({
          id: `${p.id}`,
          title: p.title,
          brand: p.vendor,
          description: p.description,
          data: p.content,
          embedding,
          store,
          lastPublished: p.lastPublished,
          handle: p.handle,
          link: p.link,
          image: p.image,
        })
      }),
    )
  }

  return embeddings
}

async function fetcher(url: string) {
  try {
    const response = await fetch(url)
    const products = (await response.json()).products as ShopifyProduct[]

    return products
  } catch (error) {
    logger(url)
  }
}

function pages(store: string) {
  return Array(5)
    .fill('_')
    .map((_, i) => `https://${store}/products.json?limit=250&page=${i + 1}`)
}

function sanitize(products: ShopifyProduct[], storeUrl: string) {
  return products.map((s) => {
    const product_description = s?.body_html ? striptags(s.body_html) : ''
    const title = s.title
    const product_type = s.product_type
    const vendor = s.vendor

    const tags = JSON.stringify(s.tags)
    const product_link = parseUrl(`${storeUrl}/products/${s.handle}`)

    let requiresShipping = false
    const prices = new Set()
    const weights = new Set()
    const images = []
    const sizes = []

    for (const variant of s.variants) {
      if (variant.price) {
        prices.add(variant.price)
      }

      if (variant.requires_shipping) {
        requiresShipping = true
      }

      if (variant.weight) {
        weights.add(`${variant.weight} ${variant.weight_unit}`)
      }
    }

    for (const option of s.options) {
      if (option.name === 'Size' && option.values?.length) {
        sizes.push(...option.values)
      }
    }

    for (const image of s.images) {
      images.push({ width: image.width, height: image.height, src: image.src })
    }

    const variants = oneLineCommaListsAnd`${s.variants?.map((s) => s.title)}`
    const description = removeWhiteSpaces(
      cap(`${title},${product_type}, ${product_description} ${cap(tags, 100)}`),
    )

    return {
      id: s.id,
      title,
      description,
      vendor,
      handle: s.handle,
      lastPublished: new Date(s.updated_at),
      link: product_link,
      image: images[0].src,
      content: JSON.stringify({
        title,
        product_type,
        description: product_description,
        product_images: images,
        product_link,
        variants,
        prices: Array.from(prices),
        weights: Array.from(weights),
        vendor,
        handle: s.handle,
        lastPublished: s.updated_at,
        createdAt: s.created_at,
        requires_shipping: requiresShipping,
      }),
    } satisfies ShopifyResponse
  })
}

function parseUrl(url: string) {
  const protocol = 'https://'
  return url.startsWith(protocol) ? url : protocol + url
}
function cap(text: string, max = 1000) {
  const ss = text.split(',')

  while (ss.join(',').length > max) {
    ss.pop()
  }

  return ss.join(',')
}

function removeWhiteSpaces(str: string) {
  return str.replace(/\s/g, ' ')
}

function chunk<T>(array: T[], chunkSize = 600) {
  // Check if the array is empty or chunkSize is not a positive integer
  if (array.length === 0 || !Number.isInteger(chunkSize) || chunkSize <= 0) {
    return []
  }

  // Calculate the number of chunks
  const numChunks = Math.ceil(array.length / chunkSize)

  // Create an array to store chunks
  const chunks = []

  // Loop through the array and create chunks
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    chunks.push(array.slice(start, end))
  }

  return chunks
}
