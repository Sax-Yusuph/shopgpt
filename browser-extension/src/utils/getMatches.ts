import { PAGE_TYPE, ShopifyProduct } from '@/types'
import Pipeline from './embeddings/pipeline'
import { getCurrentPageItems } from './fetch-current-page'
import { logger } from './logger'
import { getContext } from './matches/getContext'
import Supabase from './supabase'

interface MatchOptions {
  userMessage: string
  store: string
  pageType: PAGE_TYPE
  tabUrl: string
}

export interface GetMatchesResult {
  productContexts: string
  currentProductOnPage: ShopifyProduct
}

const space = ' '
export const getMatches = async (options: MatchOptions) => {
  const { userMessage, pageType, tabUrl, store } = options
  let query = userMessage
  const currentProductOnPage = await getCurrentPageItems(pageType, tabUrl)

  if (currentProductOnPage) {
    //provide more context to the embbedding for better results
    query += space + currentProductOnPage.product_type + space + store
  }

  query += space + store
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const embedding = await Pipeline.transform(query)
  const client = Supabase.getClient()

  const { error: matchError, data: products } = await client.rpc(
    'find_similar',
    {
      embedding,
      match_threshold: 0.8, // Choose an appropriate threshold for your data
      match_count: 20, // Choose the number of matches
      store_url: store,
    },
  )

  if (matchError) {
    logger(matchError.message)
  }

  const productContexts = getContext(products)

  return { productContexts, currentProductOnPage } as GetMatchesResult
}
