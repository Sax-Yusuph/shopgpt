import { sendMessage } from '@/scripts/background-actions'
import { Message, ShopAi } from '@/types'
import { assert } from '../assert'
import PipelineSingleton from '../embeddings/pipeline'
import { logger } from '../logger'
import Supabase from '../supabase'
import { ShopifyResponse, getProducts, sanitize } from './utils'

export async function indexStore(storeUrl: string, tabId: number) {
  const { data: isStoreCached, error: checkError } =
    await Supabase.getClient().rpc('check_store_exists', {
      store_name: storeUrl,
    })

  assert(!checkError, 'Error while checking store index')

  if (isStoreCached) {
    return logger('STORE ALREADY INDEXED')
  }

  notify(tabId, 'loading')
  const products = await getProducts(storeUrl)

  if (!products.length) {
    logger('NO PRODUCTS FOUND ', storeUrl)
    return
  }

  sendMessage(tabId, {
    action: 'event:indexing-product-items',
    params: { noOfProducts: products.length },
  } as Message)

  logger('Number of products found ', products.length)
  const san = products.map((p) => sanitize(p, storeUrl)) as ShopifyResponse[]

  const embed = await PipelineSingleton.getInstance()
  const embedAndUpload = async (
    p: ShopifyResponse,
    pageIndex: number,
    retryTimeout = 3,
  ) => {
    if (retryTimeout === 0) {
      return
    }

    const dataToEmbed = p.description

    const output = await embed(dataToEmbed, {
      pooling: 'mean',
      normalize: true,
    })

    const embedding = Array.from(output.data)

    return {
      id: `${p.id}`,
      title: p.title,
      brand: p.vendor,
      description: p.description,
      data: p.content,
      embedding,
      store: storeUrl,
      page: pageIndex + 1,
      lastPublished: p.lastPublished,
      handle: p.handle,
    }
  }

  notify(tabId, 'indexing')
  const embeddedProducts = await Promise.all(
    san.map((p, i) => embedAndUpload(p, i)),
  ).catch((error) => {
    throw error
  })

  logger('EMBEDDING COMPLETE')

  const { error } = await Supabase.getClient().from('product').upsert(
    embeddedProducts,
    // prevent duplication
    { onConflict: 'id' },
  )

  if (error) {
    logger(error)
    throw error
  }

  notify(tabId, 'ready')
  //TODO log somewhere
  logger('SHOPIFY STORE INDEXED COMPLETE')
}

function notify(tabId: number, status: ShopAi['status']) {
  sendMessage(tabId, {
    action: 'event:indexing-product-items',
    params: { status },
  } as Message)
}
