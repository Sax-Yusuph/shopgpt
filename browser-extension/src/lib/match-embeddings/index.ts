import { PAGE_TYPE, Product, ShopifyProduct } from '@/types'
import { logger } from '../logger'
import Pipeline from '../pipeline'
import Supabase from '../supabase'
import { getCurrentPageItems } from './fetch-current-page'
import { getContext } from './getContext'

interface MatchOptions {
  userMessage: string
  store: string
  pageType: PAGE_TYPE
  tabUrl: string
  sessionId: string
}

export interface GetMatchesResult {
  productContexts: string
  currentProductOnPage: ShopifyProduct
}

const previousMatches = new Map()

const space = ' '
export const getMatches = async (options: MatchOptions) => {
  const { userMessage, pageType, tabUrl, store, sessionId } = options
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

  let currentMatches = products as Product[]
  const prev = previousMatches.get(sessionId)

  if (prev) {
    currentMatches = [...prev, currentMatches]
  } else {
    previousMatches.set(sessionId, products)
  }

  if (matchError) {
    logger(matchError.message)
  }

  const productContexts = getContext(currentMatches)

  return { productContexts, currentProductOnPage } as GetMatchesResult
}
