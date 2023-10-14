import { sendMessage } from '@/lib/background-actions'
import { Message, ShopAi } from '@/types'
import { assert } from '../assert'
import { logger } from '../logger'
import Supabase from '../supabase'
import { getProductEmbeddings, getProducts } from './utils'

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

  if (!products) {
    logger('NO PRODUCTS FOUND ', storeUrl)
    return
  }

  sendMessage(tabId, {
    action: 'event:indexing-product-items',
    params: { noOfProducts: products.length },
  } as Message)

  const productsWithEmbedding = await getProductEmbeddings(products, storeUrl)
  logger('EMBEDDING COMPLETE')

  const { error } = await Supabase.getClient().from('product').upsert(
    productsWithEmbedding.filter(Boolean),
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
