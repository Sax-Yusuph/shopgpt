import { assert } from '../assert'
import PipelineSingleton from '../embeddings/pipeline'
import Supabase from '../supabase'
import { ShopifyResponse, getProducts, sanitize } from './utils'

export async function indexStore(storeUrl: string) {
  const { data: isStoreCached, error: checkError } =
    await Supabase.getClient().rpc('check_store_exists', {
      store_name: storeUrl,
    })

  assert(!checkError, 'Error while checking store index')

  if (isStoreCached) {
    console.log('STORE ALREADY INDEXED')
  }

  const products = await getProducts(storeUrl)

  if (!products.length) {
    console.log('NO PRODUCTS FOUND ', storeUrl)
    return
  }

  console.log('Number of products found ', products.length)
  console.log('storeUrl ', storeUrl)

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

  const embeddedProducts = await Promise.all(
    san.map((p, i) => embedAndUpload(p, i)),
  ).catch((error) => {
    throw error
  })

  const { error } = await Supabase.getClient().from('product').upsert(
    embeddedProducts,
    // prevent duplication
    { onConflict: 'id' },
  )

  if (error) {
    console.log(error)
    throw error
  }

  //TODO log somewhere
  return 'SHOPIFY STORE INDEXED'
}
