import { PAGE_TYPE, ShopifyProduct } from '@/types'
import { ERR, err, ok } from './error'
import { logger } from './logger'

const fetchJson = async (url: string) => {
  const startLink = url.split('?')[0]
  const link = `${startLink}.json`

  const resp = await fetch(link)

  if (!resp.ok) {
    logger(await resp.json())
    return err('Fetch failed')
  }

  const json = (await resp.json()) as { product: ShopifyProduct }
  return ok(json.product)
}

export async function getCurrentPageItems(pageType: PAGE_TYPE, tabUrl: string) {
  if (pageType === PAGE_TYPE.GENERAL) {
    return
  }

  const resp = await fetchJson(tabUrl)

  if (resp.kind === ERR) {
    return ''
  }

  return resp.value
}
